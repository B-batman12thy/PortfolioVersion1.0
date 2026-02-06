import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  
  getIcon(name: string, size: number = 24, color: string = 'currentColor'): string {
    const emojis: { [key: string]: string } = {
      // Navigation
      'home': '🏠',
      'user': '👤',
      'code': '💻',
      'rocket': '🚀',
      'briefcase': '💼',
      'mail': '✉️',

      // Stats & Actions
      'briefcase-stats': '💼',
      'rocket-stats': '🚀',
      'zap': '⚡',
      'smile': '😊',

      // Values
      'target': '🎯',
      'palette': '🎨',
      'tool': '🛠️',
      'users': '👥',

      // Actions
      'file': '📄',
      'send': '📤',
      'clock': '⏳',
      'check': '✅',
      'search': '🔍',
      'star': '⭐',
      'link': '🔗',
      'github': '🐙',
      'message': '💬',
      'arrow-right': '➡️',

      // Contact
      'phone': '📞',
      'map-pin': '📍',
      'linkedin': '💼',
      'twitter': '🐦',

      // Theme & Language
      'moon': '🌙',
      'sun': '☀️',
      'globe': '🌍',

      // Developer
      'code-user': '👨‍💻',

      // Categories
      'laptop': '💻',
      'smartphone': '📱',
      'brush': '🖌️',
    };

    return emojis[name] || '✨';
  }
}

