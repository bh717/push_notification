console.log("Service worker loaded...");

self.addEventListener('push', function(e) {
    
    console.log("data:", e.data.json());

    const data = e.data.json();
    self.registration.showNotification(
        data.title,
        {
            body: data.body,
        }
    );
})