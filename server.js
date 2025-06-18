const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const serviceAccount = require('./key.json');
const app = express();
const PORT = process.env.PORT || 3000;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/signup.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/add-blog.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'add-blog.html')));

// --- USER SIGNUP (POST) ---
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'All fields required' });

    // Check for duplicate email
    const userSnap = await db.collection('users').where('email', '==', email).get();
    if (!userSnap.empty) return res.status(409).json({ error: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user
    const userRef = await db.collection('users').add({
        name,
        email,
        password: hashedPassword,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Signup successful', userId: userRef.id });
});

// --- USER LOGIN (POST) ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields required' });

    // Find user by email
    const userSnap = await db.collection('users').where('email', '==', email).get();
    if (userSnap.empty) return res.status(401).json({ error: 'Invalid credentials' });

    const user = userSnap.docs[0].data();
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // (For real apps, generate a session or JWT here)
    res.json({ message: 'Login successful', name: user.name, email: user.email });
});

// --- GET ALL BLOGS (GET) ---
app.get('/api/blogs', async (req, res) => {
    try {
        const snapshot = await db.collection('blogs').orderBy('createdAt', 'desc').get();
        const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DELETE BLOG (DELETE) ---
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        await db.collection('blogs').doc(req.params.id).delete();
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});

// --- GET COMMENTS FOR A BLOG (GET) ---
app.get('/api/blogs/:id/comments', async (req, res) => {
    try {
        const commentsSnap = await db.collection('blogs').doc(req.params.id).collection('comments').get();
        const comments = commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// --- POST COMMENT FOR A BLOG (POST) ---
app.post('/api/blogs/:id/comments', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text is required' });
    try {
        const commentRef = await db.collection('blogs').doc(req.params.id).collection('comments').add({
            text,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.json({ id: commentRef.id, text });
    } catch (err) {
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

// --- GET SINGLE BLOG (GET) ---
app.get('/api/blogs/:id', async (req, res) => {
    try {
        const doc = await db.collection('blogs').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Blog not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
});

// --- UPDATE BLOG (PUT) ---
app.put('/api/blogs/:id', async (req, res) => {
    try {
        const { title, category, content, thumbnail } = req.body;
        const updateData = { title, category, content, thumbnail };
        await db.collection('blogs').doc(req.params.id).update(updateData);
        res.json({ message: 'Blog updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update blog' });
    }
});

// --- ADD A NEW BLOG (POST) ---
app.post('/api/blogs', async (req, res) => {
    try {
        const { title, category, content, thumbnail, author } = req.body;
        if (!title || !category || !content) {
            return res.status(400).json({ error: 'Title, category, and content are required.' });
        }
        const newBlog = {
            title,
            category,
            content,
            thumbnail: thumbnail || '',
            author: author || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('blogs').add(newBlog);
        res.json({ id: docRef.id, ...newBlog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DELETE COMMENT (DELETE) ---
app.delete('/api/blogs/:blogId/comments/:commentId', async (req, res) => {
    try {
        const { blogId, commentId } = req.params;

        // Check if blog exists
        const blogDoc = await db.collection('blogs').doc(blogId).get();
        if (!blogDoc.exists) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Check if comment exists
        const commentDoc = await db.collection('blogs')
            .doc(blogId)
            .collection('comments')
            .doc(commentId)
            .get();

        if (!commentDoc.exists) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Delete the comment
        await db.collection('blogs')
            .doc(blogId)
            .collection('comments')
            .doc(commentId)
            .delete();

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 