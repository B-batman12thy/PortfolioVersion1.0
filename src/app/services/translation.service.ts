import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'fr' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language>('fr');
  public currentLanguage$: Observable<Language> = this.currentLanguageSubject.asObservable();

  private translations: { [key: string]: { fr: string; en: string } } = {
    // Header
    'nav.home': { fr: 'Accueil', en: 'Home' },
    'nav.about': { fr: 'À propos', en: 'About' },
    'nav.skills': { fr: 'Compétences', en: 'Skills' },
    'nav.projects': { fr: 'Projets', en: 'Projects' },
    'nav.experience': { fr: 'Expérience', en: 'Experience' },
    'nav.contact': { fr: 'Contact', en: 'Contact' },

    // Hero
    'hero.greeting': { fr: 'Bonjour, je suis ', en: 'Hello, I am ' },
    'hero.name': { fr: 'Djiby Thioub', en: 'Djiby Thioub' },
    'hero.title': { fr: 'Ingénieur Logiciel & Tech Lead', en: 'Software Engineer & Tech Lead' },
    'hero.description': { fr: 'J\'accompagne la conception et le développement de solutions web et mobiles modernes, alliant innovation, performance et qualité.', en: 'I support the design and development of modern web and mobile solutions, combining innovation, performance and quality.' },
    'hero.cta': { fr: 'Me contacter', en: 'Contact me' },
    'hero.scroll': { fr: 'Faites défiler', en: 'Scroll down' },

    // About
    'about.tag': { fr: 'À propos', en: 'About' },
    'about.title': { fr: 'Qui suis-je ?', en: 'Who am I?' },
    'about.lead': { fr: 'Développeur fullstack passionné par la création de solutions web & mobiles modernes. Je transforme des idées en expériences digitales exceptionnelles.', en: 'Fullstack developer passionate about creating modern web & mobile solutions. I transform ideas into exceptional digital experiences.' },
    'about.description': { fr: 'Fort de mon expérience en tant que Tech Lead chez Tooshare, Fullstack Developer chez Socium, et concepteur du back-office de Yoon, j\'ai développé une expertise complète dans l\'écosystème web moderne.', en: 'With my experience as Tech Lead at Tooshare, Fullstack Developer at Socium, and designer of Yoon\'s back-office, I have developed comprehensive expertise in the modern web ecosystem.' },
    'about.motto': { fr: 'Impossible is nothing', en: 'Impossible is nothing' },
    'about.downloadCV': { fr: 'Télécharger CV', en: 'Download CV' },
    'about.contact': { fr: 'Me contacter', en: 'Contact me' },
    'about.values.title': { fr: 'Ce qui me motive', en: 'What motivates me' },
    'about.values.performance': { fr: 'Performance', en: 'Performance' },
    'about.values.performance.desc': { fr: 'Optimisation constante pour des applications rapides et efficaces', en: 'Constant optimization for fast and efficient applications' },
    'about.values.design': { fr: 'Design', en: 'Design' },
    'about.values.design.desc': { fr: 'Interface utilisateur moderne et expérience utilisateur intuitive', en: 'Modern user interface and intuitive user experience' },
    'about.values.innovation': { fr: 'Innovation', en: 'Innovation' },
    'about.values.innovation.desc': { fr: 'Adoption des dernières technologies et meilleures pratiques', en: 'Adoption of the latest technologies and best practices' },
    'about.values.collaboration': { fr: 'Collaboration', en: 'Collaboration' },
    'about.values.collaboration.desc': { fr: 'Travail d\'équipe et communication transparente', en: 'Teamwork and transparent communication' },
    'about.stats.experience': { fr: 'Années d\'expérience', en: 'Years of experience' },
    'about.stats.projects': { fr: 'Projets réalisés', en: 'Projects completed' },
    'about.stats.technologies': { fr: 'Technologies maîtrisées', en: 'Technologies mastered' },
    'about.stats.clients': { fr: 'Clients satisfaits', en: 'Satisfied clients' },

    // Skills
    'skills.tag': { fr: 'Compétences', en: 'Skills' },
    'skills.title': { fr: 'Mon expertise technique', en: 'My technical expertise' },
    'skills.description': { fr: 'Découvrez les technologies que je maîtrise et mon niveau d\'expertise dans chaque domaine', en: 'Discover the technologies I master and my level of expertise in each field' },
    'skills.exploring': { fr: 'En cours d\'exploration', en: 'Currently exploring' },
    'skills.stats.technologies': { fr: 'Technologies', en: 'Technologies' },
    'skills.stats.frameworks': { fr: 'Frameworks', en: 'Frameworks' },
    'skills.stats.experience': { fr: 'Années d\'expérience', en: 'Years of experience' },
    'skills.stats.projects': { fr: 'Projets réalisés', en: 'Projects completed' },
    'skills.level.expert': { fr: 'Expert', en: 'Expert' },
    'skills.level.advanced': { fr: 'Avancé', en: 'Advanced' },
    'skills.level.intermediate': { fr: 'Intermédiaire', en: 'Intermediate' },
    'skills.level.beginner': { fr: 'Débutant', en: 'Beginner' },

    // Projects
    'projects.tag': { fr: 'Portfolio', en: 'Portfolio' },
    'projects.title': { fr: 'Mes réalisations', en: 'My projects' },
    'projects.description': { fr: 'Découvrez une sélection de mes projets les plus marquants, des applications web aux solutions mobiles', en: 'Discover a selection of my most notable projects, from web applications to mobile solutions' },
    'projects.featured': { fr: 'Featured', en: 'Featured' },
    'projects.view': { fr: 'Voir le projet', en: 'View project' },
    'projects.github': { fr: 'GitHub', en: 'GitHub' },
    'projects.status.completed': { fr: 'Terminé', en: 'Completed' },
    'projects.status.inProgress': { fr: 'En cours', en: 'In progress' },
    'projects.status.maintenance': { fr: 'En maintenance', en: 'Under maintenance' },
    'projects.noProjects': { fr: 'Aucun projet trouvé', en: 'No projects found' },
    'projects.tryCategory': { fr: 'Essayez de sélectionner une autre catégorie', en: 'Try selecting another category' },
    'projects.cta.title': { fr: 'Intéressé par mon travail ?', en: 'Interested in my work?' },
    'projects.cta.description': { fr: 'Discutons de votre prochain projet ensemble', en: 'Let\'s discuss your next project together' },
    'projects.category.all': { fr: 'Tous', en: 'All' },
    'projects.category.web': { fr: 'Web Development', en: 'Web Development' },
    'projects.category.mobile': { fr: 'Mobile Development', en: 'Mobile Development' },
    'projects.category.design': { fr: 'UI/UX Design', en: 'UI/UX Design' },
    'projects.stats.projects': { fr: 'Projets réalisés', en: 'Projects completed' },
    'projects.stats.technologies': { fr: 'Technologies utilisées', en: 'Technologies used' },
    'projects.stats.clients': { fr: 'Clients satisfaits', en: 'Satisfied clients' },
    'projects.stats.experience': { fr: 'Années d\'expérience', en: 'Years of experience' },

    // Project Descriptions
    'projects.socium.description': { fr: 'Platforme SIRH moderne avec suivi des commandes, gestion des utilisateurs et tableau de bord analytics en temps réel.', en: 'Modern HRIS platform with order tracking, user management, and real-time analytics dashboard.' },
    'projects.tooshare.description': { fr: 'Plateforme de partage et collaboration avec système de permissions avancé et interface utilisateur intuitive.', en: 'Sharing and collaboration platform with advanced permission system and intuitive user interface.' },
    'projects.jaangal.description': { fr: 'Platforme edtech qui permet aux eleeves et etudiant d\'avoir un reseau social', en: 'Edtech platform allowing pupils and students to have a social network' },
    'projects.rstb.description': { fr: 'Site vitrine moderne et responsive avec animations fluides et optimisation SEO avancée.', en: 'Modern and responsive showcase site with fluid animations and advanced SEO optimization.' },
    'projects.daara.description': { fr: 'Application éducative webe gamifiée pour apprendre la programmation avec des défis interactifs.', en: 'Gamified web educational application to learn programming with interactive challenges.' },
    'projects.denkane.description': { fr: 'Refonte complète de l\'application mobile de gestion des transactions financières Orange Money.', en: 'Complete redesign of the Orange Money financial transaction management mobile application.' },
    'projects.cuberfit.description': { fr: 'Application de suivi sportif avec géolocalisation, statistiques détaillées et défis communautaires.', en: 'Sports tracking application with geolocation, detailed statistics, and community challenges.' },

    // Experience
    'experience.tag': { fr: 'Expérience', en: 'Experience' },
    'experience.title': { fr: 'Mon parcours professionnel', en: 'My professional journey' },

    // Contact
    'contact.tag': { fr: 'Contact', en: 'Contact' },
    'contact.title': { fr: 'Travaillons ensemble', en: 'Let\'s work together' },
    'contact.description': { fr: 'Une idée de projet ? Contactez-moi !', en: 'Have a project idea? Contact me!' },
    'contact.info.email': { fr: 'Email', en: 'Email' },
    'contact.info.phone': { fr: 'Téléphone', en: 'Phone' },
    'contact.info.location': { fr: 'Localisation', en: 'Location' },
    'contact.info.location.value': { fr: 'Dakar, Sénégal', en: 'Dakar, Senegal' },
    'contact.form.name': { fr: 'Nom', en: 'Name' },
    'contact.form.namePlaceholder': { fr: 'Votre nom', en: 'Your name' },
    'contact.form.email': { fr: 'Email', en: 'Email' },
    'contact.form.emailPlaceholder': { fr: 'votre.email@exemple.com', en: 'your.email@example.com' },
    'contact.form.message': { fr: 'Message', en: 'Message' },
    'contact.form.messagePlaceholder': { fr: 'Votre message...', en: 'Your message...' },
    'contact.form.send': { fr: 'Envoyer', en: 'Send' },
    'contact.form.sending': { fr: 'Envoi...', en: 'Sending...' },
    'contact.form.success': { fr: 'Message envoyé avec succès !', en: 'Message sent successfully!' }
  };

  constructor() {
    // Charger la langue sauvegardée
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      this.currentLanguageSubject.next(savedLanguage);
    } else {
      // Détecter la langue du navigateur
      const browserLang = navigator.language.split('-')[0];
      this.currentLanguageSubject.next(browserLang === 'en' ? 'en' : 'fr');
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('language', language);
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[this.currentLanguageSubject.value] || translation['fr'];
  }

  // Méthode pour obtenir une traduction directement (pour les templates)
  get(key: string): string {
    return this.translate(key);
  }
}

