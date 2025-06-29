// Memilih elemen-elemen HTML yang dibutuhkan
const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');

// Fungsi untuk membuat atau mendapatkan Session ID dari browser
function getSessionId() {
    let sessionId = localStorage.getItem('chatbot_session_id');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('chatbot_session_id', sessionId);
    }
    return sessionId;
}

// Tampilkan/Sembunyikan jendela chat saat tombol diklik
chatButton.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
});

// Kirim pesan saat form disubmit
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage('user', userMessage);
        sendMessageToBot(userMessage);
        userInput.value = '';
    }
});

// Fungsi untuk menambahkan pesan ke jendela chat
function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.innerText = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fungsi untuk mengirim pesan ke backend Python
async function sendMessageToBot(message) {
    addMessage('bot', '...'); // Tampilkan indikator loading

    const sessionId = getSessionId();

    try {
        const response = await fetch('https://gunadarma-chatbot-api.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                session_id: sessionId
            })
        });

        // Hapus indikator loading
        chatMessages.removeChild(chatMessages.lastChild);

        if (!response.ok) {
            addMessage('bot', 'Maaf, server sedang bermasalah.');
            return;
        }

        const data = await response.json();
        addMessage('bot', data.response);

    } catch (error) {
        chatMessages.removeChild(chatMessages.lastChild);
        console.error('Error:', error);
        addMessage('bot', 'Tidak dapat terhubung ke server. Pastikan server backend sudah berjalan.');
    }
}

// Tambahkan pesan selamat datang dari bot
window.addEventListener('load', () => {
     addMessage('bot', 'Halo! Selamat datang di Info Center Gunadarma. Mau tanya apa hari ini?');
});