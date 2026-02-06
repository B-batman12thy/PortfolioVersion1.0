import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService, Language } from '../../services/translation.service';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDark = false;
  isScrolled = false;
  isHeaderVisible = true;
  currentLanguage: Language = 'fr';
  private languageSubscription?: Subscription;
  
  private lastScrollTop = 0;
  private scrollThreshold = 5; // Seuil minimum pour détecter le scroll
  private hideThreshold = 100; // Position à partir de laquelle le header peut se cacher

  constructor(
    private translationService: TranslationService,
    private iconService: IconService
  ) { }

  ngOnInit(): void {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.isDark = true;
      document.body.classList.add('dark-mode');
    } else {
      this.isDark = false;
      document.body.classList.remove('dark-mode');
    }

    // S'abonner aux changements de langue
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.languageSubscription = this.translationService.currentLanguage$.subscribe(
      lang => this.currentLanguage = lang
    );
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    this.isScrolled = scrollTop > 100;
    
    if (Math.abs(scrollTop - this.lastScrollTop) > this.scrollThreshold) {
      if (scrollTop > this.lastScrollTop && scrollTop > this.hideThreshold) {
        this.isHeaderVisible = false;
      } else {
        this.isHeaderVisible = true;
      }
      
      this.lastScrollTop = scrollTop;
    }
    
    if (scrollTop <= this.hideThreshold) {
      this.isHeaderVisible = true;
    }
  }

  toggleDarkMode(): void {
    const body = document.body;
    this.isDark = !this.isDark;
    
    if (this.isDark) {
      body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
    
    // Forcer la détection de changement
    setTimeout(() => {
      // S'assurer que le changement est bien appliqué
    }, 0);
  }

  toggleLanguage(): void {
    const newLanguage: Language = this.currentLanguage === 'fr' ? 'en' : 'fr';
    this.translationService.setLanguage(newLanguage);
    // La mise à jour de currentLanguage se fera via l'observable
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  getIcon(name: string, size: number = 20): string {
    return this.iconService.getIcon(name, size);
  }
}