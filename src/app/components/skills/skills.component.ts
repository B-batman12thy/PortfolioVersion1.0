import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';
import { IconService } from '../../services/icon.service';

type IconVal = string;

interface Skill {
  name: string;
  level: number;
  icon: IconVal;
  experience: string;
}

interface SkillCategory {
  title: string;
  titleKey?: string;
  icon: IconVal;
  color: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, OnDestroy {
  @ViewChild('skillsSection', { static: true }) skillsSection!: ElementRef;
  private languageSubscription?: Subscription;

  // Catégories de compétences avec niveaux
  skillCategories: SkillCategory[] = [
    {
      title: 'Frontend',
      icon: 'assets/icons/icon_angular.png',
      color: '#3b82f6',
      skills: [
        { name: 'Angular',      level: 95, icon: 'assets/icons/icon_angular.png',   experience: '4 ans' },
        { name: 'React',        level: 90, icon: 'assets/icons/icon_react.png',     experience: '3 ans' },
        { name: 'TypeScript',   level: 92, icon: 'assets/icons/icon_typescript.png',experience: '4 ans' },
        { name: 'HTML/CSS',     level: 95, icon: 'assets/icons/icon_html.png',      experience: '6 ans' },
        { name: 'SCSS/Sass',    level: 88, icon: 'assets/icons/icon_scss.png',      experience: '3 ans' }
      ]
    },
    {
      title: 'Backend',
      icon: 'assets/icons/nest_icon.svg', // mets un png si tu en as, sinon un emoji fonctionne aussi
      color: '#10b981',
      skills: [
        { name: 'NestJS',      level: 90, icon: 'assets/icons/nest_icon.svg',   experience: '3 ans' },
        { name: 'Node.js',     level: 88, icon: 'assets/icons/icon_nodeJS.png',     experience: '4 ans' },
        { name: 'Spring Boot', level: 85, icon: 'assets/icons/spring_icon.svg',   experience: '2 ans' },
        { name: 'Express.js',  level: 87, icon: 'assets/icons/express_icon.png',  experience: '3 ans' },
        { name: 'GraphQL',     level: 80, icon: 'assets/icons/graph_icon.png',  experience: '2 ans' }
      ]
    },
    {
      title: 'Base de données',
      icon: 'assets/icons/mongoDB_icon.webp',
      color: '#f59e0b',
      skills: [
        { name: 'MongoDB',    level: 90, icon: 'assets/icons/mongoDB_icon.webp',   experience: '3 ans' },
        { name: 'PostgreSQL', level: 85, icon: 'assets/icons/postgrel_icon.png',experience: '3 ans' },
        { name: 'Redis',      level: 75, icon: 'assets/icons/redis_icon.png',   experience: '1 an'  },
        { name: 'MySQL',      level: 80, icon: 'assets/icons/mysql_icon.png',   experience: '5 ans' }
      ]
    },
    {
      title: 'DevOps & Cloud',
      icon: 'assets/icons/docker_icon.png',
      color: '#8b5cf6',
      skills: [
        { name: 'Docker',    level: 85, icon: 'assets/icons/docker_icon.png',  experience: '3 ans' },
        { name: 'AWS',       level: 80, icon: 'assets/icons/aws_icon.png',     experience: '3 ans' },
        { name: 'Git/GitHub',level: 95, icon: 'assets/icons/github_icon.png',     experience: '5 ans' },
        { name: 'CI/CD',     level: 75, icon: 'assets/icons/cicd_icon.svg',    experience: '2 an'  }
      ]
    }
  ];

  // Statistiques générales
  stats = [
    { labelKey: 'skills.stats.technologies', label: '', value: 20, suffix: '+', iconName: 'zap' },
    { labelKey: 'skills.stats.frameworks', label: '', value: 8,  suffix: '+', iconName: 'tool' },
    { labelKey: 'skills.stats.experience', label: '', value: 5,  suffix: '+', iconName: 'briefcase-stats' },
    { labelKey: 'skills.stats.projects', label: '', value: 30, suffix: '+', iconName: 'rocket-stats' }
  ];

  activeCategory = 0;
  isVisible = false;
  animationStarted = false;

  constructor(
    private translationService: TranslationService,
    private iconService: IconService
  ) {}

  ngOnInit(): void {
    this.updateTranslations();
    this.setupIntersectionObserver();
    
    // S'abonner aux changements de langue
    this.languageSubscription = this.translationService.currentLanguage$.subscribe(() => {
      this.updateTranslations();
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
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // Helpers d'icône : image d'assets vs emoji/texte
  isImageIcon(val: IconVal): boolean {
    return typeof val === 'string' && (
      val.startsWith('assets/') ||
      /\.(png|jpe?g|svg|webp|gif)$/i.test(val)
    );
  }
  isEmojiIcon(val: IconVal): boolean {
    return !this.isImageIcon(val);
  }

  // Observer pour déclencher les animations
  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isVisible) {
            this.isVisible = true;
            if (!this.animationStarted) {
              this.animationStarted = true;
              setTimeout(() => {
                this.animateSkillBars();
              }, 800);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (this.skillsSection) {
      observer.observe(this.skillsSection.nativeElement);
    }
  }

  // Animation des barres de progression
  private animateSkillBars(): void {
    this.skillCategories.forEach((category, categoryIndex) => {
      category.skills.forEach((skill, skillIndex) => {
        const delay = (categoryIndex * 200) + (skillIndex * 100);
        setTimeout(() => {
          const skillElement = document.querySelector(
            `[data-skill="${skill.name}"] .skill-progress-fill`
          );
          if (skillElement) {
            (skillElement as HTMLElement).style.width = `${skill.level}%`;
          }
        }, delay);
      });
    });
  }

  // Changer de catégorie active
  setActiveCategory(index: number): void {
    this.activeCategory = index;
  }

  // Obtenir la couleur d'une compétence selon son niveau
  getSkillColor(level: number): string {
    if (level >= 90) return '#10b981'; // Vert - Expert
    if (level >= 80) return '#3b82f6'; // Bleu - Avancé
    if (level >= 70) return '#f59e0b'; // Orange - Intermédiaire
    return '#ef4444'; // Rouge - Débutant
  }

  // Obtenir le libellé du niveau
  getSkillLevel(level: number): string {
    if (level >= 90) return this.translate('skills.level.expert');
    if (level >= 80) return this.translate('skills.level.advanced');
    if (level >= 70) return this.translate('skills.level.intermediate');
    return this.translate('skills.level.beginner');
  }

  getIcon(name: string, size: number = 24): string {
    return this.iconService.getIcon(name, size);
  }
}
