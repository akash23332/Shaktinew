// Service Worker for Medicine Reminder Notifications
const CACHE_NAME = 'medicine-tracker-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(clients.claim());
});

// Handle background notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, urgent, medication } = event.data;

    self.registration.showNotification(title, {
      body: body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: medication ? `medicine-${medication.id}` : 'medicine-reminder',
      requireInteraction: urgent,
      silent: false,
      vibrate: urgent ? [200, 100, 200, 100, 200] : [100, 50, 100],
      actions: medication ? [
        { action: 'take', title: '✅ Mark as Taken' },
        { action: 'snooze', title: '⏰ Snooze 15min' }
      ] : []
    });
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'take') {
    // Mark as taken - send message to main thread
    event.waitUntil(
      clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'MARK_TAKEN',
            medicationId: event.notification.data.medicationId
          });
        });
      })
    );
  } else if (event.action === 'snooze') {
    // Snooze medication reminder
    event.waitUntil(
      clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SNOOZE_MEDICATION',
            medicationId: event.notification.data.medicationId
          });
        });
      })
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle push notifications (for future Firebase integration)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: data.tag || 'medicine-reminder',
      requireInteraction: data.urgent || false,
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Medicine Reminder', options)
    );
  }
});