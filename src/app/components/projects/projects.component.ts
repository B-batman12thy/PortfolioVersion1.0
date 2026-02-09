import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';
import { IconService } from '../../services/icon.service';

interface Project {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  technologies: string[];
  status: 'Terminé' | 'En cours' | 'En maintenance';
  statusKey?: string;
  year: string;
  github?: string;
  featured?: boolean;
  descriptionKey?: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @ViewChild('projectsSection', { static: true }) projectsSection!: ElementRef;
  private languageSubscription?: Subscription;

  categories = [
    { name: 'Tous', nameKey: 'projects.category.all', iconName: 'rocket-stats', count: 0 },
    { name: 'Web Development', nameKey: 'projects.category.web', iconName: 'laptop', count: 0 },
    { name: 'Mobile Development', nameKey: 'projects.category.mobile', iconName: 'smartphone', count: 0 },
    { name: 'UI/UX Design', nameKey: 'projects.category.design', iconName: 'brush', count: 0 }
  ];

  selectedCategory = 'Tous';
  isVisible = false;
  filteredProjects: Project[] = [];

  projects: Record<string, Project[]> = {
    'Web Development': [
      {
        title: 'Socium',
        description: 'Platforme SIRH moderne avec suivi des commandes, gestion des utilisateurs et tableau de bord analytics en temps réel.',
        link: 'https://socium.link/',
        imageUrl: '/assets/socium.jpeg',
        technologies: ['Angular', 'TypeScript', 'RxJS', 'Material UI'],
        status: 'Terminé',
        year: '2024',
        github: 'https://github.com/djiby/yoon-admin',
        featured: true,
        descriptionKey: 'projects.socium.description'
      },
      {
        title: 'Tooshare Platform',
        description: 'Plateforme de partage et collaboration avec système de permissions avancé et interface utilisateur intuitive.',
        link: 'https://www.tooshare.com/',
        imageUrl: '/assets/tooshare.jpg',
        technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
        status: 'Terminé',
        year: '2023',
        featured: true,
        descriptionKey: 'projects.tooshare.description'
      },
      {
        title: 'Jaangal ',
        description: 'Platforme edtech qui permet aux eleeves et etudiant d\'avoir un reseau social',
        link: 'https://app-demo.jaangal.com/?q=',
        imageUrl: '/assets/jaangal.png',
        technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
        status: 'Terminé',
        year: '2024',
        descriptionKey: 'projects.jaangal.description'
      },
      {
        title: 'RSTB platform',
        description: 'Site vitrine moderne et responsive avec animations fluides et optimisation SEO avancée.',
        link: 'https://rstb-link.com/',
        imageUrl: '/assets/rstb.webp',
        technologies: ['Angular', 'SCSS', 'Three.js', 'Vercel'],
        status: 'Terminé',
        year: '2025',
        descriptionKey: 'projects.rstb.description'
      }
    ],
    'Mobile Development': [
      {
        title: 'Daara Academy',
        description: 'Application éducative webe gamifiée pour apprendre la programmation avec des défis interactifs.',
        link: 'https://daaraacademy.com/',
        imageUrl: '/assets/daaara-academy.png',
        technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
        status: 'Terminé',
        year: '2023',
        featured: true,
        descriptionKey: 'projects.daara.description'
      },
      {
        title: 'Denkane Mobile',
        description: 'Refonte complète de l\'application mobile de gestion des transactions financières Orange Money.',
        link: 'https://denkane.sn',
        imageUrl: '/assets/denkane.jpg',
        technologies: ['Ionic', 'Angular', 'Capacitor', 'Firebase'],
        status: 'En maintenance',
        year: '2023',
        descriptionKey: 'projects.denkane.description'
      },
      {
        title: 'Cuberfit',
        description: 'Application de suivi sportif avec géolocalisation, statistiques détaillées et défis communautaires.',
        link: 'https://www.cuberfit.com',
        imageUrl: '/assets/cuberfit.webp',
        technologies: ['Flutter', 'Dart', 'Firebase', 'Google Maps'],
        status: 'En cours',
        year: '2024',
        descriptionKey: 'projects.cuberfit.description'
      }
    ],
    // 'UI/UX Design': [
    //   {
    //     title: 'Design System RSE',
    //     description: 'Création d\'un système de design complet pour la plateforme RSE avec composants réutilisables.',
    //     link: 'https://figma.com/design-system-rse',
    //     imageUrl: '/assets/projects/design-system.jpg',
    //     technologies: ['Figma', 'Design Tokens', 'Storybook', 'Atomic Design'],
    //     status: 'Terminé',
    //     year: '2024',
    //     featured: true
    //   },
    //   {
    //     title: 'Mockups E-commerce',
    //     description: 'Wireframes et prototypes haute fidélité pour une expérience d\'achat optimisée et conversion améliorée.',
    //     link: 'https://figma.com/ecommerce-mockups',
    //     imageUrl: '/assets/projects/ecommerce-ui.jpg',
    //     technologies: ['Figma', 'Principle', 'Sketch', 'Adobe XD'],
    //     status: 'Terminé',
    //     year: '2023'
    //   },

    // ]
  };

  // Stats des projets
  projectStats = [
    { labelKey: 'projects.stats.projects', label: '', value: 10, iconName: 'rocket-stats' },
    { labelKey: 'projects.stats.technologies', label: '', value: 25, iconName: 'zap' },
    { labelKey: 'projects.stats.clients', label: '', value: 8, iconName: 'smile' },
    { labelKey: 'projects.stats.experience', label: '', value: 5, iconName: 'briefcase-stats' }
  ];

  constructor(
    private translationService: TranslationService,
    private iconService: IconService
  ) { }

  ngOnInit(): void {
    this.updateTranslations();
    this.calculateCategoryCounts();
    this.filterProjects();
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
    this.projectStats.forEach(stat => {
      stat.label = this.translationService.translate(stat.labelKey);
    });

    // Mettre à jour les noms des catégories
    this.categories.forEach(cat => {
      if (cat.nameKey) {
        cat.name = this.translationService.translate(cat.nameKey);
      }
    });

    // Update project descriptions
    Object.values(this.projects).forEach(categoryProjects => {
      categoryProjects.forEach(project => {
        if (project.descriptionKey) {
          project.description = this.translationService.translate(project.descriptionKey);
        }
      });
    });
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  getIcon(name: string, size: number = 24): string {
    return this.iconService.getIcon(name, size);
  }

  // Calculer le nombre de projets par catégorie
  private calculateCategoryCounts(): void {
    let totalCount = 0;
    Object.keys(this.projects).forEach(category => {
      const count = this.projects[category].length;
      const categoryObj = this.categories.find(cat => cat.name === category);
      if (categoryObj) {
        categoryObj.count = count;
      }
      totalCount += count;
    });

    // Mettre à jour le count pour "Tous"
    const allCategory = this.categories.find(cat => cat.name === 'Tous');
    if (allCategory) {
      allCategory.count = totalCount;
    }
  }

  // Observer pour les animations
  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
          }
        });
      },
      { threshold: 0.3 }
    );

    if (this.projectsSection) {
      observer.observe(this.projectsSection.nativeElement);
    }
  }

  // Sélectionner une catégorie
  selectCategory(categoryName: string): void {
    // Trouver la catégorie originale si c'est une traduction
    const category = this.categories.find(cat =>
      cat.name === categoryName ||
      (cat.nameKey && this.translate(cat.nameKey) === categoryName)
    );

    if (category) {
      // Utiliser le nom original pour la sélection
      this.selectedCategory = category.nameKey
        ? this.getOriginalCategoryName(category.nameKey)
        : category.name;
    } else {
      this.selectedCategory = categoryName;
    }

    this.filterProjects();
  }

  // Vérifier si une catégorie est active
  isCategoryActive(category: any): boolean {
    if (this.selectedCategory === category.name) {
      return true;
    }
    // Vérifier aussi avec la traduction
    if (category.nameKey && this.translate(category.nameKey) === this.selectedCategory) {
      return true;
    }
    // Pour "Tous"
    if (this.selectedCategory === 'Tous' && category.name === 'Tous') {
      return true;
    }
    if (this.selectedCategory === this.translate('projects.category.all') && category.name === 'Tous') {
      return true;
    }
    return false;
  }

  // Filtrer les projets selon la catégorie
  private filterProjects(): void {
    const allCategoryName = this.translate('projects.category.all');
    if (this.selectedCategory === 'Tous' || this.selectedCategory === allCategoryName) {
      this.filteredProjects = [];
      Object.values(this.projects).forEach(projects => {
        this.filteredProjects.push(...projects);
      });
    } else {
      // Trouver la catégorie originale en anglais
      const originalCategory = this.categories.find(cat =>
        cat.name === this.selectedCategory ||
        (cat.nameKey && this.translate(cat.nameKey) === this.selectedCategory)
      );
      if (originalCategory) {
        // Utiliser la clé originale pour trouver les projets
        const categoryKey = originalCategory.nameKey
          ? this.getOriginalCategoryName(originalCategory.nameKey)
          : originalCategory.name;
        this.filteredProjects = this.projects[categoryKey] || [];
      } else {
        this.filteredProjects = this.projects[this.selectedCategory] || [];
      }
    }
  }

  private getOriginalCategoryName(nameKey: string): string {
    const mapping: { [key: string]: string } = {
      'projects.category.all': 'Tous',
      'projects.category.web': 'Web Development',
      'projects.category.mobile': 'Mobile Development',
      'projects.category.design': 'UI/UX Design'
    };
    return mapping[nameKey] || nameKey;
  }

  // Obtenir la couleur du statut
  getStatusColor(status: string): string {
    switch (status) {
      case 'Terminé': return '#10b981';
      case 'En cours': return '#f59e0b';
      case 'En maintenance': return '#3b82f6';
      default: return '#6b7280';
    }
  }

  getStatusTranslation(status: string): string {
    switch (status) {
      case 'Terminé': return this.translate('projects.status.completed');
      case 'En cours': return this.translate('projects.status.inProgress');
      case 'En maintenance': return this.translate('projects.status.maintenance');
      default: return status;
    }
  }

  // Ouvrir un lien
  openProject(link: string): void {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  }

  // Ouvrir GitHub
  openGithub(github: string | undefined): void {
    if (github) {
      window.open(github, '_blank', 'noopener,noreferrer');
    }
  }

  /** Défile vers la section contact (évite NG04002) */
  scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}