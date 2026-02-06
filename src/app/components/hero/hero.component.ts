import { Component, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { gsap } from 'gsap';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // Structure du texte pour un meilleur contrôle - sera mise à jour dynamiquement
  textParts: any[] = [];
  private languageSubscription?: Subscription;

  // Configuration des logos pour chaque bulle
  bubbleLogos = [
    { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
    { name: 'Angular', icon: 'angular', color: '#DD0031' },
    { name: 'React', icon: 'react', color: '#61DAFB' },
    { name: 'Node.js', icon: 'nodejs', color: '#339933' },
    { name: 'NestJS', icon: 'nestjs', color: '#E0234E' },
    { name: 'AWS', icon: 'aws', color: '#FF9900' },
    { name: 'Docker', icon: 'docker', color: '#2496ED' },
    { name: 'PostgreSQL', icon: 'postgresql', color: '#336791' },
    { name: 'MongoDB', icon: 'mongodb', color: '#47A248' },
    { name: 'Prisma', icon: 'prisma', color: '#2D3748' },
    { name: 'Git', icon: 'git', color: '#F05032' },
    { name: 'VSCode', icon: 'vscode', color: '#007ACC' },
    { name: 'Figma', icon: 'figma', color: '#F24E1E' },
    { name: 'GraphQL', icon: 'graphql', color: '#E10098' },
    { name: 'Redis', icon: 'redis', color: '#DC382D' },
    { name: 'Kubernetes', icon: 'kubernetes', color: '#326CE5' },
    { name: 'Python', icon: 'python', color: '#3776AB' },
    { name: 'Java', icon: 'java', color: '#ED8B00' },
    { name: 'Oracle', icon: 'oracle', color: '#F80000' },
    { name: 'Firebase', icon: 'firebase', color: '#FFCA28' }
  ];
  
  displayedText = '';
  private currentPartIndex = 0;
  private currentCharIndex = 0;
  private typingTimeout: any;
  private masterTimeline?: gsap.core.Timeline;
  private typingSpeed = 30; // Vitesse de frappe en ms (ajustable)

  constructor(
    private translationService: TranslationService,
    private iconService: IconService
  ) {}

  ngOnInit(): void {
    // Initialiser les textParts avec les traductions
    this.updateTextParts();
    
    // S'abonner aux changements de langue
    this.languageSubscription = this.translationService.currentLanguage$.subscribe(() => {
      this.updateTextParts();
      // Redémarrer l'animation si elle était déjà en cours
      if (this.displayedText) {
        this.displayedText = '';
        this.currentPartIndex = 0;
        this.currentCharIndex = 0;
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }
        setTimeout(() => {
          this.startTyping();
        }, 300);
      }
    });

    // Démarrer l'animation de frappe après un court délai
    setTimeout(() => {
      this.startTyping();
    }, 500);
  }

  private updateTextParts(): void {
    this.textParts = [
      { 
        tag: 'h4', 
        content: this.translationService.translate('hero.greeting'), 
        highlight: this.translationService.translate('hero.name'), 
        highlightClass: 'purple' 
      },
      { 
        tag: 'h5', 
        content: this.translationService.translate('hero.title') 
      },
      { 
        tag: 'p', 
        content: this.translationService.translate('hero.description') 
      }
    ];
  }

  ngAfterViewInit(): void {
    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      this.createParticles();
      this.createBubbleLogos();
      this.initializeAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    // Nettoyage des timeouts et animations
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    gsap.killTweensOf('.bubble');
    gsap.killTweensOf('.particle');
  }

  /**
   * Effet de machine à écrire amélioré et smooth
   */
  private startTyping(): void {
    this.currentPartIndex = 0;
    this.currentCharIndex = 0;
    this.displayedText = '';
    this.typeNextPart();
  }

  private typeNextPart(): void {
    if (this.currentPartIndex >= this.textParts.length) {
      // Animation terminée, retirer le curseur
      this.removeCursor();
      return;
    }

    const part = this.textParts[this.currentPartIndex];
    const fullContent = part.highlight 
      ? part.content + part.highlight 
      : part.content;

    if (this.currentCharIndex < fullContent.length) {
      // Construire le texte affiché avec les balises HTML
      this.updateDisplayedText();
      
      const char = fullContent.charAt(this.currentCharIndex);
      this.currentCharIndex++;
      
      // Vitesse variable pour un effet plus naturel
      const speed = this.getTypingSpeed(char);
      this.typingTimeout = setTimeout(() => this.typeNextPart(), speed);
    } else {
      // Afficher la partie complète sans curseur
      this.updateDisplayedTextComplete();
      
      // Partie terminée, passer à la suivante
      this.currentPartIndex++;
      this.currentCharIndex = 0;
      
      // Pause entre les parties
      if (this.currentPartIndex < this.textParts.length) {
        this.typingTimeout = setTimeout(() => this.typeNextPart(), 500);
      } else {
        // Dernière partie terminée, retirer le curseur
        this.removeCursor();
      }
    }
  }

  private updateDisplayedText(): void {
    const part = this.textParts[this.currentPartIndex];
    const currentContent = part.content.substring(0, Math.min(this.currentCharIndex, part.content.length));
    const currentHighlight = part.highlight 
      ? part.highlight.substring(0, Math.max(0, this.currentCharIndex - part.content.length))
      : '';

    let html = '';
    
    // Construire le HTML pour toutes les parties complètes
    for (let i = 0; i < this.currentPartIndex; i++) {
      const p = this.textParts[i];
      html += this.buildPartHTML(p, true);
    }
    
    // Construire le HTML pour la partie en cours
    if (part.highlight) {
      const highlightStart = part.content.length;
      if (this.currentCharIndex <= highlightStart) {
        // On est encore dans le contenu normal
        html += `<${part.tag}>${currentContent}<span class="typing-cursor">|</span></${part.tag}>`;
      } else {
        // On est dans le highlight
        html += `<${part.tag}>${part.content}<span class="${part.highlightClass}">${currentHighlight}<span class="typing-cursor">|</span></span></${part.tag}>`;
      }
    } else {
      html += `<${part.tag}>${currentContent}<span class="typing-cursor">|</span></${part.tag}>`;
    }

    this.displayedText = html;
  }

  private updateDisplayedTextComplete(): void {
    // Afficher la partie actuelle complète sans curseur
    let html = '';
    
    // Construire le HTML pour toutes les parties complètes
    for (let i = 0; i <= this.currentPartIndex; i++) {
      const p = this.textParts[i];
      html += this.buildPartHTML(p, true);
    }
    
    this.displayedText = html;
  }

  private removeCursor(): void {
    // Retirer le curseur et afficher le texte final
    let html = '';
    for (let i = 0; i < this.textParts.length; i++) {
      html += this.buildPartHTML(this.textParts[i], true);
    }
    this.displayedText = html;
  }

  private buildPartHTML(part: any, isComplete: boolean): string {
    if (part.highlight) {
      return `<${part.tag}>${part.content}<span class="${part.highlightClass}">${part.highlight}</span></${part.tag}>`;
    } else {
      return `<${part.tag}>${part.content}</${part.tag}>`;
    }
  }

  private getTypingSpeed(char: string): number {
    // Vitesse variable pour un effet plus naturel
    if (char === ' ') {
      return this.typingSpeed * 0.5; // Plus rapide pour les espaces
    } else if (char === '.' || char === '!' || char === '?') {
      return this.typingSpeed * 3; // Pause après la ponctuation
    } else if (char === ',' || char === ';') {
      return this.typingSpeed * 2; // Petite pause
    } else {
      return this.typingSpeed + Math.random() * 10; // Variation aléatoire
    }
  }

  /**
   * Création des particules flottantes
   */
  private createParticles(): void {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    // Nettoyer les particules existantes
    particlesContainer.innerHTML = '';

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 12 + 's';
      particle.style.animationDuration = (8 + Math.random() * 8) + 's';
      particlesContainer.appendChild(particle);
    }
  }
  downloadCV(): void {
    // Remplacez par le lien vers votre CV
    const link = document.createElement('a');
    link.href = '/assets/CV_Djiby_Thioub.pdf';
    link.download = 'CV_Djiby_Thioub.pdf';
    link.click();
  }
private initializeAnimations(): void {
    // Vérifier que les éléments existent
    const bubbles = document.querySelectorAll('.bubble');
    const leftContent = document.querySelector('.left');
    const rightContent = document.querySelector('.right');
    const ctaButton = document.querySelector('.cta-button');

    if (!bubbles.length || !leftContent || !rightContent || !ctaButton) {
      console.warn('Certains éléments du hero ne sont pas trouvés');
      return;
    }

    // Timeline principale
    this.masterTimeline = gsap.timeline({ 
      defaults: { ease: 'power2.out' },
      paused: false
    });

    // Animation d'apparition des bulles (sans variation de couleur)
    this.masterTimeline.to('.bubble', {
      opacity: 0.7,
      scale: 1,
      duration: 0.8,
      stagger: {
        amount: 2,
        from: 'random'
      },
      ease: 'back.out(1.7)'
    });

    // Animation du contenu gauche
    this.masterTimeline.to('.left', {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=1.2');

    // Animation du contenu droit
    this.masterTimeline.to('.right', {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.8');

    // Animation du bouton CTA
    this.masterTimeline.to('.cta-button', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.3');

    // Animations des bulles (mouvement uniquement)
    this.startContinuousAnimations();
  }
  /**
   * Création des logos dans les bulles
   */
  private createBubbleLogos(): void {
    const bubbles = document.querySelectorAll('.bubble');
    
    bubbles.forEach((bubble, index) => {
      if (index < this.bubbleLogos.length) {
        const logo = this.bubbleLogos[index];
        
        // Créer le conteneur du logo
        const logoContainer = document.createElement('div');
        logoContainer.className = 'bubble-logo';
        logoContainer.innerHTML = this.getLogoSVG(logo.icon, logo.color);
        
        // Ajouter un tooltip
        logoContainer.title = logo.name;
        logoContainer.setAttribute('aria-label', logo.name);
        
        bubble.appendChild(logoContainer);
      }
    });
  }

  /**
   * Retourne le SVG du logo selon l'icône demandée
   */
  private getLogoSVG(icon: string, color: string): string {
    const svgMap: { [key: string]: string } = {
      'typescript': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>`,
      
      'angular': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M9.93 12.645h4.134L12 9.03l-2.07 3.615z"/><path d="M12 2.5L3.21 5.55l1.34 11.64L12 21.5l7.45-4.31 1.34-11.64L12 2.5zm6.18 15.11H16.7l-1.39-2.91H8.68l-1.39 2.91H5.82L12 4.6l6.18 13.01z"/></svg>`,
      
      'react': `<svg viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="11" ry="4" fill="none" stroke="${color}" stroke-width="1"/><ellipse cx="12" cy="12" rx="4" ry="11" fill="none" stroke="${color}" stroke-width="1" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="4" ry="11" fill="none" stroke="${color}" stroke-width="1" transform="rotate(-60 12 12)"/></svg>`,
      
      'nodejs': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l7.44 4.3c.46.26 1.04.26 1.5 0l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.51-.2-.78-.2z"/></svg>`,
      
      'nestjs': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M14.131.047c-.173 0-.334.037-.483.087.316.21.49.49.576.806.007.043.019.074.025.117a.681.681 0 0 1 .013.112c.024.545-.143.614-.26.936-.18.415-.13.861.086 1.22a.74.74 0 0 0 .074.137c-.235-1.568 1.073-1.803 1.314-2.293.019-.043.031-.08.044-.117.025-.074.056-.173.063-.235.067-.61-.607-1.408-1.452-1.77zm-1.618 2.778c-.175.148-.284.369-.284.606 0 .238.109.459.284.606l4.531 3.77c.175.147.411.147.586 0l4.531-3.77c.175-.147.284-.368.284-.606 0-.237-.109-.458-.284-.606L17.63 2.825c-.175-.147-.411-.147-.586 0l-4.531 3.77z"/></svg>`,
      
      'aws': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M6.763 10.036c0 .296.032.535.088.718a4.8 4.8 0 0 0 .263.718c.043.087.043.174 0 .218-.131.131-.218.174-.348.283l-1.131.805c-.087.043-.174.043-.283 0a2.8 2.8 0 0 1-.348-.348 6.8 6.8 0 0 1-.283-.479c-.7.849-1.58 1.262-2.655 1.262-.718 0-1.305-.218-1.697-.633C.13 12.17-.043 11.626-.043 10.865c0-.805.283-1.479.892-1.979.609-.5 1.393-.718 2.373-.718.327 0 .675.043 1.045.087.37.043.718.131 1.132.218v-.718c0-.718-.152-1.22-.413-1.523-.283-.305-.805-.435-1.566-.435a5.4 5.4 0 0 0-1.045.087c-.37.043-.718.152-1.045.283-.152.043-.283.043-.37-.043s-.087-.152-.087-.283v-.435c0-.152.043-.283.152-.348a1.8 1.8 0 0 1 .37-.152c.37-.152.783-.283 1.262-.37A5.4 5.4 0 0 1 2.96 5.1c1.045 0 1.828.239 2.329.718.522.479.783 1.218.783 2.198l-.043 2.022zm-3.665 1.393c.305 0 .631-.043.979-.152s.631-.283.849-.522c.152-.152.283-.348.348-.566a2.2 2.2 0 0 0 .087-.675v-.327c-.283-.043-.588-.087-.914-.087s-.631-.043-.935-.043c-.675 0-1.176.152-1.523.435s-.5.675-.5 1.176c0 .479.13.831.37 1.089.283.239.631.37 1.045.37l.194-.022z"/></svg>`,
      
      'docker': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186"/></svg>`,
      
      'postgresql': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M17.128 0C15.624-.007 14.065.474 12.849 1.292 11.633 2.109 10.76 3.265 10.23 4.561c-.265.649-.398 1.332-.398 2.042 0 .71.133 1.393.398 2.042.53 1.296 1.403 2.452 2.619 3.269 1.216.818 2.775 1.299 4.279 1.292 1.504.007 3.063-.474 4.279-1.292 1.216-.817 2.089-1.973 2.619-3.269.265-.649.398-1.332.398-2.042 0-.71-.133-1.393-.398-2.042C23.295 3.265 22.422 2.109 21.206 1.292 19.99.474 18.632-.007 17.128 0z"/></svg>`,
      
      'mongodb': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.205.486-.455 1.046-.735 1.44-.321.701-3.309 2.535-4.573 8.115-1.373 6.056-.594 11.677-.594 11.677.001.024.003.049.003.075.114 1.297.551 2.517 1.237 3.421.9 1.186 2.181 1.856 3.573 1.856a5.77 5.77 0 0 0 3.573-1.856c.686-.904 1.123-2.124 1.237-3.421.001-.024.003-.049.003-.075-.001 0 .779-5.621-.594-11.677z"/></svg>`,
      
      'prisma': `<svg viewBox="0 0 24 24" fill="${color}"><path d="m21.807 18.285-4.391-13.622c-.428-1.328-2.142-1.704-2.934-.642L9.664 10.7l-1.777 3.073c-.435.753-.009 1.71.87 1.95l8.253 2.261c1.256.344 2.496-.885 2.109-2.09l-.312-.609z"/></svg>`,
      
      'git': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.715.713 1.875 0 2.59-.719.717-1.881.717-2.6 0-.717-.714-.717-1.875 0-2.59.177-.18.38-.319.605-.406V8.835c-.226-.088-.428-.228-.606-.407-.545-.544-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0L23.546 13.12c.603-.603.603-1.582 0-2.187"/></svg>`,
      
      'vscode': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>`,
      
      'figma': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.02s-1.354-3.02-3.019-3.02h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981z"/></svg>`,
      
      'graphql': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M5.08 5.291c.005-.127.028-.253.07-.374.041-.121.101-.235.175-.337.074-.102.164-.189.267-.258.103-.07.217-.124.338-.161.121-.037.248-.056.375-.056.127 0 .254.019.375.056.121.037.235.091.338.161.103.069.193.156.267.258.074.102.134.216.175.337.042.121.065.247.07.374l4.465 2.633c.105-.079.224-.142.351-.186.127-.044.261-.067.396-.067.135 0 .269.023.396.067.127.044.246.107.351.186l4.465-2.633c.005-.127.028-.253.07-.374.041-.121.101-.235.175-.337.074-.102.164-.189.267-.258.103-.07.217-.124.338-.161.121-.037.248-.056.375-.056s.254.019.375.056c.121.037.235.091.338.161.103.069.193.156.267.258.074.102.134.216.175.337.042.121.065.247.07.374.005.127-.014.254-.056.375-.042.121-.103.235-.178.337-.075.102-.167.189-.274.258-.107.069-.226.122-.351.158-.125.036-.256.054-.388.054-.132 0-.263-.018-.388-.054-.125-.036-.244-.089-.351-.158-.107-.069-.199-.156-.274-.258-.075-.102-.136-.216-.178-.337-.042-.121-.061-.248-.056-.375l-4.465-2.633c-.105.079-.224.142-.351.186-.127.044-.261.067-.396.067-.135 0-.269-.023-.396-.067-.127-.044-.246-.107-.351-.186L5.544 7.924c.005.127-.014.254-.056.375-.042.121-.103.235-.178.337-.075.102-.167.189-.274.258-.107.069-.226.122-.351.158-.125.036-.256.054-.388.054-.132 0-.263-.018-.388-.054-.125-.036-.244-.089-.351-.158-.107-.069-.199-.156-.274-.258-.075-.102-.136-.216-.178-.337-.042-.121-.061-.248-.056-.375.005-.127.028-.253.07-.374.041-.121.101-.235.175-.337.074-.102.164-.189.267-.258.103-.07.217-.124.338-.161.121-.037.248-.056.375-.056s.254.019.375.056c.121.037.235.091.338.161.103.069.193.156.267.258.074.102.134.216.175.337.042.121.065.247.07.374z"/></svg>`,
      
      'redis': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M10.5 2.661l.54.997-1.617.919c-.816.461-1.205.693-1.205 1.252 0 .559.389.79 1.205 1.252l1.617.918-.54.997-1.617-.918c-1.477-.835-1.477-1.835 0-2.67l1.617-.919zM14.5 2.661l1.617.919c1.477.835 1.477 1.835 0 2.67l-1.617.918-.54-.997 1.617-.918c.816-.462 1.205-.693 1.205-1.252 0-.559-.389-.79-1.205-1.252L14.5 2.661l.54-.997z"/></svg>`,
      
      'kubernetes': `<svg viewBox="0 0 24 24" fill="${color}"><path d="m10.204 14.35-.007.01-.999 2.413a5.171 5.171 0 0 0 2.503.639c.906 0 1.741-.278 2.434-.752l-.04-.012-.488-2.395c-.344.09-.703.14-1.084.14-.456 0-.89-.06-1.319-.143zm.613-1.96c-.043-.307-.043-.628 0-.937L9.597 9.04c-.47.407-.813.92-1.016 1.499-.01.028-.017.057-.027.085l2.26.766zm2.174 0 2.26-.766c-.01-.028-.017-.057-.027-.085-.203-.579-.546-1.092-1.016-1.499l-1.22 2.413c.043.309.043.63 0 .937zM12 10.856c.36 0 .717.037 1.056.11l.487-2.395c-.007-.002-.013-.006-.02-.008-.65-.248-1.356-.38-2.079-.38-.723 0-1.43.132-2.079.38-.007.002-.013.006-.02.008l.487 2.395c.339-.073.696-.11 1.056-.11z"/></svg>`,
      
      'python': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.26-.02.2-.01h4.9l.19.02.3.06.4.11.45.16.49.21.51.26.51.3.49.33.45.35.4.36.34.36.26.35.17.33.1.3.04.25.01.2V6.07l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V.18z"/></svg>`,
      
      'java': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218"/></svg>`,
      
      'oracle': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M18.68 12.32c0 1.73-.02 3.46-.02 5.19-.01 1.41-1.18 2.58-2.59 2.59H7.93c-1.41-.01-2.58-1.18-2.59-2.59V6.49c.01-1.41 1.18-2.58 2.59-2.59h8.14c1.41.01 2.58 1.18 2.59 2.59.02 1.94.02 3.89.02 5.83zM7.93 5.9c-.29 0-.55.26-.55.59v11.02c0 .33.26.59.55.59h8.14c.29 0 .55-.26.55-.59V6.49c0-.33-.26-.59-.55-.59H7.93z"/></svg>`,
      
      'firebase': `<svg viewBox="0 0 24 24" fill="${color}"><path d="M5.803 21.089l2.756-17.08L11.78 11.21l-5.977 9.878zM21.005 19.54L18.543 6.771c-.235-.86-1.408-.93-1.767-.105L14.22 10.88 8.688 2.302c-.414-.647-1.46-.647-1.874 0L2.995 6.771c-.235.86.245 1.74 1.105 1.74h.01l5.977-.01 3.02 5.04-4.29 7.14c-.36.61-.08 1.39.63 1.39h9.58c.71 0 1.09-.78.73-1.39z"/></svg>`
    };
    return svgMap[icon] || `<svg viewBox="0 0 24 24" fill="${color}"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="${color}">${icon}</text></svg>`;
  }   
  /**
   * Démarre les animations continues des bulles
   */
   private startContinuousAnimations(): void {
    // Animation principale de flottement
    gsap.to('.bubble', {
      y: () => -20 - Math.random() * 30,
      x: () => -15 + Math.random() * 30,
      rotation: () => Math.random() * 360,
      scale: () => 0.8 + Math.random() * 0.4,
      duration: () => 6 + Math.random() * 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: {
        amount: 3,
        from: 'random'
      }
    });

    // Animation de rotation lente pour certaines bulles
    gsap.to('.bubble:nth-child(3n)', {
      rotation: 360,
      duration: 20,
      ease: 'none',
      repeat: -1
    });
  }
  private onImageHover(): void {
    gsap.to('.bubble', {
      scale: 1.3,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.out'
    });
  }
  private onImageLeave(): void {
    gsap.to('.bubble', {
      scale: 1,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.out'
    });
  }

  /**
   * Initialise les interactions sur le hero
   */
  private setupInteractions(): void {
    const heroImage = document.querySelector('.right img');
    
    if (heroImage) {
      // Animation au survol de l'image
      heroImage.addEventListener('mouseenter', this.onImageHover.bind(this));
      heroImage.addEventListener('mouseleave', this.onImageLeave.bind(this));
    }

    // Animation au clic sur le bouton CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', this.onCtaClick.bind(this));
    }
  }
   private onCtaClick(event: Event): void {
    // Animation de "pulse" sur les bulles (sans variation de couleur)
    gsap.to('.bubble', {
      scale: 1.5,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      stagger: 0.02,
      ease: 'power2.inOut'
    });

    // Petit délai avant la navigation
    setTimeout(() => {
      // La navigation sera gérée par routerLink dans le template
    }, 300);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  getIcon(name: string, size: number = 24): string {
    return this.iconService.getIcon(name, size);
  }
}
