// service-worker.js

self.addEventListener('install', event => {
    console.log('Service Worker installed');
  });
  
  self.addEventListener('push', event => {
    const options = {
      body: event.data ? event.data.text() : "Solve the equation to stop the alarm.",
      actions: [{action: 'playSound', title: 'Solve Equation'}]
    };
    event.waitUntil(
      self.registration.showNotification('Alarm Clock', options)
    );
  });
  
  self.addEventListener('notificationclick', event => {
    event.notification.close();
  
    if (event.action === 'playSound') {
      // Open the page or focus it if it's already open, then play sound
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
          .then(windowClients => {
            if (windowClients.length > 0) {
              windowClients[0].focus();
              windowClients[0].postMessage({ action: 'playSound' });
            } else {
              clients.openWindow('/').then(windowClient => windowClient.postMessage({ action: 'playSound' }));
            }
          })
      );
    }
  });
  