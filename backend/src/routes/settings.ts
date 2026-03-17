import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { userQueries } from '../models';
import axios from 'axios';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get notification settings
router.get('/notifications', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const settings = await userQueries.getNotificationSettings(userId);

    if (!settings) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      telegram_bot_token: settings.telegram_bot_token || null,
      telegram_chat_id: settings.telegram_chat_id || null,
      telegram_enabled: settings.telegram_enabled ?? true,
      discord_webhook_url: settings.discord_webhook_url || null,
      discord_enabled: settings.discord_enabled ?? true,
      pushover_user_key: settings.pushover_user_key || null,
      pushover_app_token: settings.pushover_app_token || null,
      pushover_enabled: settings.pushover_enabled ?? true,
      ntfy_topic: settings.ntfy_topic || null,
      ntfy_server_url: settings.ntfy_server_url || null,
      ntfy_username: settings.ntfy_username || null,
      ntfy_password: settings.ntfy_password || null,
      ntfy_enabled: settings.ntfy_enabled ?? true,
      gotify_url: settings.gotify_url || null,
      gotify_app_token: settings.gotify_app_token || null,
      gotify_enabled: settings.gotify_enabled ?? true,
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ error: 'Failed to fetch notification settings' });
  }
});

// Update notification settings
router.put('/notifications', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      telegram_bot_token,
      telegram_chat_id,
      telegram_enabled,
      discord_webhook_url,
      discord_enabled,
      pushover_user_key,
      pushover_app_token,
      pushover_enabled,
      ntfy_topic,
      ntfy_server_url,
      ntfy_username,
      ntfy_password,
      ntfy_enabled,
      gotify_url,
      gotify_app_token,
      gotify_enabled,
    } = req.body;

    const settings = await userQueries.updateNotificationSettings(userId, {
      telegram_bot_token,
      telegram_chat_id,
      telegram_enabled,
      discord_webhook_url,
      discord_enabled,
      pushover_user_key,
      pushover_app_token,
      pushover_enabled,
      ntfy_topic,
      ntfy_server_url,
      ntfy_username,
      ntfy_password,
      ntfy_enabled,
      gotify_url,
      gotify_app_token,
      gotify_enabled,
    });

    if (!settings) {
      res.status(400).json({ error: 'No settings to update' });
      return;
    }

    res.json({
      telegram_bot_token: settings.telegram_bot_token || null,
      telegram_chat_id: settings.telegram_chat_id || null,
      telegram_enabled: settings.telegram_enabled ?? true,
      discord_webhook_url: settings.discord_webhook_url || null,
      discord_enabled: settings.discord_enabled ?? true,
      pushover_user_key: settings.pushover_user_key || null,
      pushover_app_token: settings.pushover_app_token || null,
      pushover_enabled: settings.pushover_enabled ?? true,
      ntfy_topic: settings.ntfy_topic || null,
      ntfy_server_url: settings.ntfy_server_url || null,
      ntfy_username: settings.ntfy_username || null,
      ntfy_password: settings.ntfy_password || null,
      ntfy_enabled: settings.ntfy_enabled ?? true,
      gotify_url: settings.gotify_url || null,
      gotify_app_token: settings.gotify_app_token || null,
      gotify_enabled: settings.gotify_enabled ?? true,
      message: 'Notification settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
});

// Test Telegram notification
router.post('/notifications/test/telegram', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const settings = await userQueries.getNotificationSettings(userId);

    if (!settings?.telegram_bot_token || !settings?.telegram_chat_id) {
      res.status(400).json({ error: 'Telegram not configured' });
      return;
    }

    const { sendTelegramNotification } = await import('../services/notifications');
    const success = await sendTelegramNotification(
      settings.telegram_bot_token,
      settings.telegram_chat_id,
      {
        productName: 'Test Product',
        productUrl: 'https://example.com',
        type: 'price_drop',
        oldPrice: 29.99,
        newPrice: 19.99,
        currency: 'USD',
      }
    );

    if (success) {
      res.json({ message: 'Test notification sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send test notification' });
    }
  } catch (error) {
    console.error('Error sending test Telegram notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// Test Discord notification
router.post('/notifications/test/discord', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const settings = await userQueries.getNotificationSettings(userId);

    if (!settings?.discord_webhook_url) {
      res.status(400).json({ error: 'Discord not configured' });
      return;
    }

    const { sendDiscordNotification } = await import('../services/notifications');
    const success = await sendDiscordNotification(settings.discord_webhook_url, {
      productName: 'Test Product',
      productUrl: 'https://example.com',
      type: 'price_drop',
      oldPrice: 29.99,
      newPrice: 19.99,
      currency: 'USD',
    });

    if (success) {
      res.json({ message: 'Test notification sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send test notification' });
    }
  } catch (error) {
    console.error('Error sending test Discord notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// Test Pushover notification
router.post('/notifications/test/pushover', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const settings = await userQueries.getNotificationSettings(userId);

    if (!settings?.pushover_user_key || !settings?.pushover_app_token) {
      res.status(400).json({ error: 'Pushover not configured' });
      return;
    }

    const { sendPushoverNotification } = await import('../services/notifications');
    const success = await sendPushoverNotification(
      settings.pushover_user_key,
      settings.pushover_app_token,
      {
        productName: 'Test Product',
        productUrl: 'https://example.com',
        type: 'price_drop',
        oldPrice: 29.99,
        newPrice: 19.99,
        currency: 'USD',
      }
    );

    if (success) {
      res.json({ message: 'Test notification sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send test notification' });
    }
  } catch (error) {
    console.error('Error sending test Pushover notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// Test ntfy notification
router.post('/notifications/test/ntfy', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const settings = await userQueries.getNotificationSettings(userId);

    if (!settings?.ntfy_topic) {
      res.status(400).json({ error: 'ntfy not configured' });
      return;
    }

    const { sendNtfyNotification } = await import('../services/notifications');
    const success = await sendNtfyNotification(
      settings.ntfy_topic,
      {
        productName: 'Test Product',
        productUrl: 'https://example.com',
        type: 'price_drop',
        oldPrice: 29.99,
        newPrice: 19.99,
        currency: 'USD',
      },
      settings.ntfy_server_url,
      settings.ntfy_username,
      settings.ntfy_password
    );

    if (success) {
      res.json({ message: 'Test notification sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send test notification' });
    }
  } catch (error) {
    console.error('Error sending test ntfy notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// Test Gotify connection (before saving)
router.post('/notifications/test-gotify', async (req: AuthRequest, res: Response) => {
  try {
    const { url, app_token } = req.body;

    if (!url || !app_token) {
      res.status(400).json({ error: 'Server URL and app token are required' });
      return;
    }

    const { testGotifyConnection } = await import('../services/notifications');
    const result = await testGotifyConnection(url, app_token);

    if (result.success) {
      res.json({ success: true, message: 'Successfully connected to Gotify server' });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error testing Gotify connection:', error);
    res.status(500).json({ error: 'Failed to test Gotify connection' });
  }
});

// Test Gotify notification (after saving)
router.post('/notifications/test/gotify', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const settings = await userQueries.getNotificationSettings(userId);

    if (!settings?.gotify_url || !settings?.gotify_app_token) {
      res.status(400).json({ error: 'Gotify not configured' });
      return;
    }

    const { sendGotifyNotification } = await import('../services/notifications');
    const success = await sendGotifyNotification(
      settings.gotify_url,
      settings.gotify_app_token,
      {
        productName: 'Test Product',
        productUrl: 'https://example.com',
        type: 'price_drop',
        oldPrice: 29.99,
        newPrice: 19.99,
        currency: 'USD',
      }
    );

    if (success) {
      res.json({ message: 'Test notification sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send test notification' });
    }
  } catch (error) {
    console.error('Error sending test Gotify notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// Get proxy settings
router.get('/proxy', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const settings = await userQueries.getProxySettings(userId);

    if (!settings) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      proxy_enabled: settings.proxy_enabled || false,
      proxy_url: settings.proxy_url || null,
      proxy_username: settings.proxy_username || null,
      proxy_password: settings.proxy_password || null,
    });
  } catch (error) {
    console.error('Error fetching proxy settings:', error);
    res.status(500).json({ error: 'Failed to fetch proxy settings' });
  }
});

// Update proxy settings
router.put('/proxy', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { proxy_enabled, proxy_url, proxy_username, proxy_password } = req.body;

    const settings = await userQueries.updateProxySettings(userId, {
      proxy_enabled,
      proxy_url,
      proxy_username,
      proxy_password,
    });

    if (!settings) {
      res.status(400).json({ error: 'No settings to update' });
      return;
    }

    res.json({
      proxy_enabled: settings.proxy_enabled || false,
      proxy_url: settings.proxy_url || null,
      proxy_username: settings.proxy_username || null,
      proxy_password: settings.proxy_password || null,
      message: 'Proxy settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating proxy settings:', error);
    res.status(500).json({ error: 'Failed to update proxy settings' });
  }
});

// Test proxy by fetching exit IP
router.post('/proxy/test', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const settings = await userQueries.getProxySettings(userId);

    if (!settings?.proxy_enabled || !settings?.proxy_url) {
      res.status(400).json({ error: 'Proxy is not enabled or configured' });
      return;
    }

    // Build axios proxy config
    let proxyConfig = {};
    try {
      const parsed = new URL(settings.proxy_url);
      if (parsed.protocol.startsWith('http')) {
        proxyConfig = {
          proxy: {
            protocol: parsed.protocol.replace(':', ''),
            host: parsed.hostname,
            port: parseInt(parsed.port),
            ...(settings.proxy_username ? {
              auth: { username: settings.proxy_username, password: settings.proxy_password || '' }
            } : {})
          }
        };
      }
    } catch {
      res.status(400).json({ error: 'Invalid proxy URL format' });
      return;
    }

    const response = await axios.get<{ origin: string }>('https://httpbin.org/ip', {
      ...proxyConfig,
      timeout: 15000,
    });

    res.json({
      success: true,
      exit_ip: response.data.origin,
      message: `Proxy working. Exit IP: ${response.data.origin}`,
    });
  } catch (error) {
    console.error('Error testing proxy:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: `Proxy test failed: ${errorMessage}` });
  }
});

export default router;
