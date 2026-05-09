// Admin Password (You can change this!)
const ADMIN_PASSWORD = 'Admintest10';
let isAdminLoggedIn = false;

// Blog posts storage (localStorage)
let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [
  {
    id: 1,
    title: 'Getting Started with Web Development',
    category: 'Web Dev',
    date: 'May 4, 2026',
    excerpt: 'Learn the basics of web development and start building your first website. This comprehensive guide covers HTML, CSS, and JavaScript fundamentals...',
    content: 'Web development is an exciting field that combines creativity with technical skills. Whether you\'re interested in front-end or back-end development, there are many resources available to help you get started. With practice and dedication, you can build amazing websites and applications that impact millions of users worldwide.',
    image: null
  },
  {
    id: 2,
    title: 'CSS Grid vs Flexbox: When to Use Each',
    category: 'CSS',
    date: 'May 2, 2026',
    excerpt: 'Understanding the differences between CSS Grid and Flexbox can help you write better layouts. Let\'s explore when to use each layout system...',
    content: 'CSS Grid is perfect for two-dimensional layouts where you need to control both rows and columns. Flexbox, on the other hand, excels at one-dimensional layouts and is great for navigation bars, centering content, and distributing space. Learning when to use each will make you a more efficient developer.',
    image: null
  },
  {
    id: 3,
    title: 'JavaScript Tips and Tricks for Beginners',
    category: 'JavaScript',
    date: 'April 28, 2026',
    excerpt: 'Discover useful JavaScript tips that will help you write cleaner, more efficient code. From arrow functions to template literals, we cover it all...',
    content: 'JavaScript is a powerful language that runs in every browser. Learning best practices early will save you debugging headaches later. Use const by default, understand closures, and leverage modern ES6+ features to write maintainable code.',
    image: null
  }
];

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Blog "Read More" toggle functionality
function toggleBlogContent(element) {
  const fullContent = element.nextElementSibling;
  const isHidden = fullContent.style.display === 'none';
  
  fullContent.style.display = isHidden ? 'block' : 'none';
  element.textContent = isHidden ? 'Read Less' : 'Read More';
}

// Load and display blog posts
function loadBlogPosts() {
  const blogContainer = document.querySelector('.blog-posts');
  if (!blogContainer) return;
  
  blogContainer.innerHTML = '';
  blogPosts.forEach(post => {
    const article = document.createElement('article');
    article.className = 'blog-post';
    article.innerHTML = `
      ${post.image ? `<img src="${post.image}" style="width: 100%; height: auto; border-radius: 5px; margin-bottom: 1rem;">` : ''}
      <h3>${post.title}</h3>
      <div class="blog-meta">
        <span class="date">${post.date}</span>
        <span class="category">${post.category}</span>
      </div>
      <p>${post.excerpt}</p>
      <button class="read-more-btn" onclick="toggleBlogContent(this)">Read More</button>
      <div class="full-content" style="display: none;">
        <p>${post.content}</p>
      </div>
    `;
    blogContainer.appendChild(article);
  });
}

// Admin Panel Functions
function showAdminLogin() {
  document.getElementById('adminModal').style.display = 'block';
  document.getElementById('adminLogin').style.display = 'block';
  document.getElementById('adminDashboard').style.display = 'none';
}

function closeAdminModal() {
  document.getElementById('adminModal').style.display = 'none';
  if (!isAdminLoggedIn) {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
  }
}

function loginAdmin() {
  const password = document.getElementById('adminPassword').value;
  if (password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    displayAdminPosts();
  } else {
    alert('Incorrect password!');
    document.getElementById('adminPassword').value = '';
  }
}

function logoutAdmin() {
  isAdminLoggedIn = false;
  document.getElementById('adminPassword').value = '';
  closeAdminModal();
}

function showAddBlogForm() {
  document.getElementById('addBlogForm').style.display = 'block';
}

function cancelAddBlog() {
  document.getElementById('addBlogForm').style.display = 'none';
  document.getElementById('blogTitle').value = '';
  document.getElementById('blogCategory').value = '';
  document.getElementById('blogExcerpt').value = '';
  document.getElementById('blogContent').value = '';
  document.getElementById('blogImage').value = '';
}

function addBlogPost() {
  const title = document.getElementById('blogTitle').value;
  const category = document.getElementById('blogCategory').value;
  const excerpt = document.getElementById('blogExcerpt').value;
  const content = document.getElementById('blogContent').value;
  const imageInput = document.getElementById('blogImage');

  if (!title || !category || !excerpt || !content) {
    alert('Please fill in all fields!');
    return;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let imageData = null;
  
  // Handle image upload
  if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imageData = e.target.result;
      
      const newPost = {
        id: Math.max(...blogPosts.map(p => p.id), 0) + 1,
        title: title,
        category: category,
        date: dateStr,
        excerpt: excerpt,
        content: content,
        image: imageData
      };

      blogPosts.unshift(newPost);
      localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
      
      loadBlogPosts();
      displayAdminPosts();
      cancelAddBlog();
      alert('Blog post added successfully!');
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    const newPost = {
      id: Math.max(...blogPosts.map(p => p.id), 0) + 1,
      title: title,
      category: category,
      date: dateStr,
      excerpt: excerpt,
      content: content,
      image: null
    };

    blogPosts.unshift(newPost);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    
    loadBlogPosts();
    displayAdminPosts();
    cancelAddBlog();
    alert('Blog post added successfully!');
  }
}

function displayAdminPosts() {
  const adminList = document.getElementById('adminPostsList');
  adminList.innerHTML = '';

  blogPosts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'admin-post-item';
    div.innerHTML = `
      <h4>${post.title}</h4>
      <p><strong>Category:</strong> ${post.category} | <strong>Date:</strong> ${post.date}</p>
      <p>${post.excerpt.substring(0, 100)}...</p>
      <div class="admin-post-buttons">
        <button class="btn-edit" onclick="editBlogPost(${post.id})">Edit</button>
        <button class="btn-delete" onclick="deleteBlogPost(${post.id})">Delete</button>
      </div>
    `;
    adminList.appendChild(div);
  });
}

function deleteBlogPost(id) {
  if (confirm('Are you sure you want to delete this post?')) {
    blogPosts = blogPosts.filter(post => post.id !== id);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    loadBlogPosts();
    displayAdminPosts();
    alert('Post deleted!');
  }
}

function editBlogPost(id) {
  const post = blogPosts.find(p => p.id === id);
  if (post) {
    document.getElementById('blogTitle').value = post.title;
    document.getElementById('blogCategory').value = post.category;
    document.getElementById('blogExcerpt').value = post.excerpt;
    document.getElementById('blogContent').value = post.content;
    document.getElementById('addBlogForm').style.display = 'block';
    
    // Store id for update
    window.editingPostId = id;
    
    const saveBtn = document.querySelector('#addBlogForm button');
    const oldText = saveBtn.textContent;
    saveBtn.textContent = 'Update Post';
    saveBtn.onclick = function() {
      updateBlogPost(id);
      saveBtn.textContent = oldText;
      saveBtn.onclick = addBlogPost;
      window.editingPostId = null;
    };
  }
}

function updateBlogPost(id) {
  const title = document.getElementById('blogTitle').value;
  const category = document.getElementById('blogCategory').value;
  const excerpt = document.getElementById('blogExcerpt').value;
  const content = document.getElementById('blogContent').value;

  if (!title || !category || !excerpt || !content) {
    alert('Please fill in all fields!');
    return;
  }

  const post = blogPosts.find(p => p.id === id);
  post.title = title;
  post.category = category;
  post.excerpt = excerpt;
  post.content = content;

  localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  loadBlogPosts();
  displayAdminPosts();
  cancelAddBlog();
  alert('Post updated successfully!');
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('adminModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Load blog posts on page load
document.addEventListener('DOMContentLoaded', loadBlogPosts);

console.log('Watson blog website loaded successfully!');
