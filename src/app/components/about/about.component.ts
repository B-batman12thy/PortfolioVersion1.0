import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  @ViewChild('aboutSection', { static: true }) aboutSection!: ElementRef;
  private languageSubscription?: Subscription;

  // Statistiques avec valeurs finales et valeurs animées séparées
  stats = [
    {
      labelKey: 'about.stats.experience',
      label: '',
      finalValue: 5,
      currentValue: 0,
      suffix: '+',
      iconName: 'briefcase-stats'
    },
    {
      labelKey: 'about.stats.projects',
      label: '',
      finalValue: 30,
      currentValue: 0,
      suffix: '+',
      iconName: 'rocket-stats'
    },
    {
      labelKey: 'about.stats.technologies',
      label: '',
      finalValue: 15,
      currentValue: 0,
      suffix: '+',
      iconName: 'zap'
    },
    {
      labelKey: 'about.stats.clients',
      label: '',
      finalValue: 20,
      currentValue: 0,
      suffix: '+',
      iconName: 'smile'
    }
  ];

  // Valeurs et passions
  values = [
    {
      iconName: 'target',
      titleKey: 'about.values.performance',
      title: '',
      descriptionKey: 'about.values.performance.desc',
      description: ''
    },
    {
      iconName: 'palette',
      titleKey: 'about.values.design',
      title: '',
      descriptionKey: 'about.values.design.desc',
      description: ''
    },
    {
      iconName: 'tool',
      titleKey: 'about.values.innovation',
      title: '',
      descriptionKey: 'about.values.innovation.desc',
      description: ''
    },
    {
      iconName: 'users',
      titleKey: 'about.values.collaboration',
      title: '',
      descriptionKey: 'about.values.collaboration.desc',
      description: ''
    }
  ];

  // Technologies favorites
  favoriteTools = [
    'Angular', 'React', 'Node.js', 'TypeScript',
    'MongoDB', 'PostgreSQL', 'Docker', 'AWS'
  ];

  isVisible = false;
  animationStarted = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private translationService: TranslationService,
    private iconService: IconService
  ) { }

  ngOnInit(): void {
    this.updateTranslations();
    this.setupIntersectionObserver();

    // S'abonner aux changements de langue
    this.languageSubscription = this.translationService.currentLanguage$.subscribe(() => {
      this.updateTranslations();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private updateTranslations(): void {
    // Mettre à jour les labels des stats
    this.stats.forEach(stat => {
      stat.label = this.translationService.translate(stat.labelKey);
    });

    // Mettre à jour les valeurs
    this.values.forEach(value => {
      value.title = this.translationService.translate(value.titleKey);
      value.description = this.translationService.translate(value.descriptionKey);
    });
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  getIcon(name: string, size: number = 24): string {
    return this.iconService.getIcon(name, size);
  }

  // Observer pour déclencher les animations au scroll
  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isVisible) {
            this.isVisible = true;
            if (!this.animationStarted) {
              this.animationStarted = true;
              // Petit délai pour que l'animation CSS se déclenche d'abord
              setTimeout(() => {
                this.animateStats();
              }, 500);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (this.aboutSection) {
      observer.observe(this.aboutSection.nativeElement);
    }
  }

  // Animation des statistiques corrigée
  private animateStats(): void {
    this.stats.forEach((stat, index) => {
      let current = 0;
      const increment = stat.finalValue / 100; // Plus fluide avec 100 étapes

      // Délai différent pour chaque stat
      setTimeout(() => {
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.finalValue) {
            stat.currentValue = stat.finalValue;
            clearInterval(timer);
          } else {
            stat.currentValue = Math.floor(current);
          }
          // Forcer la détection de changement
          this.cdr.detectChanges();
        }, 20); // Animation plus fluide
      }, index * 200); // Délai échelonné
    });
  }

  // Fonction pour télécharger le CV
  downloadCV(): void {
    // Remplacez par le lien vers votre CV
    const link = document.createElement('a');
    link.href = '/assets/CV_Djiby_Thioub.pdf';
    link.download = 'CV_Djiby_Thioub.pdf';
    link.click();
  }
}