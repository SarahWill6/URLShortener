let recentUrls = JSON.parse(localStorage.getItem('recentUrls')) || [];

function displayRecentUrls() {
    const urlList = document.getElementById('urlList');
    
    if (recentUrls.length === 0) {
        urlList.innerHTML = '<p style="color: #666; font-style: italic;">No URLs shortened yet</p>';
        return;
    }
    
    urlList.innerHTML = recentUrls.map(url => `
        <div style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 4px solid #667eea;">
            <div style="font-weight: bold; margin-bottom: 5px;">${url.shortUrl}</div>
            <div style="color: #666; font-size: 0.9em; word-break: break-all;">${url.originalUrl}</div>
            <div style="color: #888; font-size: 0.8em; margin-top: 5px;">
                Created: ${new Date(url.createdAt).toLocaleDateString()}
            </div>
        </div>
    `).join('');
}

async function shortenUrl() {
    const urlInput = document.getElementById('urlInput');
    const customAlias = document.getElementById('customAlias');
    const resultSection = document.getElementById('result');
    const shortUrlInput = document.getElementById('shortUrl');
    
    const originalUrl = urlInput.value.trim();
    const alias = customAlias.value.trim();
    
    if (!originalUrl) {
        alert('Please enter a URL');
        return;
    }
    
    // Basic URL validation
    try {
        new URL(originalUrl);
    } catch (e) {
        alert('Please enter a valid URL (include http:// or https://)');
        return;
    }
    
    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                originalUrl: originalUrl,
                customAlias: alias || undefined
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            shortUrlInput.value = data.shortUrl;
            resultSection.style.display = 'block';
            
            // Save to recent URLs
            const newUrl = {
                originalUrl: data.originalUrl,
                shortUrl: data.shortUrl,
                shortCode: data.shortCode,
                createdAt: new Date().toISOString()
            };
            
            recentUrls.unshift(newUrl);
            if (recentUrls.length > 10) {
                recentUrls = recentUrls.slice(0, 10);
            }
            
            localStorage.setItem('recentUrls', JSON.stringify(recentUrls));
            displayRecentUrls();
            
            // Clear inputs
            urlInput.value = '';
            customAlias.value = '';
        } else {
            alert(data.error || 'An error occurred');
        }
    } catch (error) {
        alert('Network error. Please try again.');
        console.error('Error:', error);
    }
}

function copyUrl() {
    const shortUrlInput = document.getElementById('shortUrl');
    shortUrlInput.select();
    shortUrlInput.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#667eea';
        }, 2000);
    } catch (err) {
        alert('Failed to copy URL');
    }
}

// Allow Enter key to shorten URL
document.addEventListener('DOMContentLoaded', function() {
    displayRecentUrls();
    
    const urlInput = document.getElementById('urlInput');
    const customAlias = document.getElementById('customAlias');
    
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            shortenUrl();
        }
    });
    
    customAlias.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            shortenUrl();
        }
    });
});