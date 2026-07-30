importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC3oVT1UjGLksc7pws6GMSkZC2L0Puj9Mk",
  authDomain: "care-drrmc-alerts.firebaseapp.com",
  projectId: "care-drrmc-alerts",
  storageBucket: "care-drrmc-alerts.firebasestorage.app",
  messagingSenderId: "219371503949",
  appId: "1:219371503949:web:423a6901e9f926c14b3704"
});

const messaging = firebase.messaging();

// Handle background notifications when app tab is closed
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Message Received:', payload);

  const title = payload.notification ? payload.notification.title : '🚨 DRRMC EMERGENCY ALERT';
  const body = payload.notification ? payload.notification.body : 'Critical warning from DRRMC';

  const notificationOptions = {
    body: body,
    icon: 'https://img.icons8.com/color/96/000000/siren.png',
    badge: 'https://img.icons8.com/color/48/000000/siren.png',
    vibrate: [300, 100, 300, 100, 300],
    tag: 'emergency-alert',
    renotify: true,
    data: payload.data || {}
  };

  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
