document.addEventListener('DOMContentLoaded', () => {
    // Fetch GitHub Stats
    fetchGitHubStats();

    // Tab Switching
    setupTabs();

    // Copy to Clipboard
    setupCopyButtons();
});

async function fetchGitHubStats() {
    const repo = 'etcdfinder/etcdfinder';

    try {
        // Fetch Repo Info
        const repoResponse = await fetch(`https://api.github.com/repos/${repo}`);
        const repoData = await repoResponse.json();

        if (repoData.stargazers_count) {
            const stars = formatNumber(repoData.stargazers_count);
            document.getElementById('stars-count').textContent = stars;
        }

        // Fetch Latest Release
        const releasesResponse = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
        const releaseData = await releasesResponse.json();

        if (releaseData.tag_name) {
            // Remove 'v' prefix if it exists in tag_name but we already have 'v' in HTML
            const version = releaseData.tag_name.replace(/^v/, '');
            document.getElementById('latest-version').textContent = version;
        }
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Fallback or leave defaults
    }
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Add active class to target pane
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function setupCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pre = btn.parentElement.querySelector('pre');
            const code = pre.textContent;

            navigator.clipboard.writeText(code).then(() => {
                const originalIcon = btn.innerHTML;

                // Change icon to checkmark
                btn.innerHTML = '<i class="fa-solid fa-check" style="color: #4ade80;"></i>';

                setTimeout(() => {
                    btn.innerHTML = originalIcon;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy API key: ', err);
            });
        });
    });
}
