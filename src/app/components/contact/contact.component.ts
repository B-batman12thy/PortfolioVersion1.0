import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  @ViewChild('contactSection', { static: true }) contactSection!: ElementRef;
  private languageSubscription?: Subscription;

  // État du formulaire
  formData = {
    name: '',
    email: '',
    message: ''
  };

  isVisible = false;
  isSubmitting = false;
  showSuccess = false;

  constructor(
    private translationService: TranslationService,
    private iconService: IconService
  ) { }

  ngOnInit(): void {
    this.setupIntersectionObserver();
    
    // S'abonner aux changements de langue
    this.languageSubscription = this.translationService.currentLanguage$.subscribe(() => {
      // Les traductions sont gérées directement dans le template
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  getIcon(name: string, size: number = 24): string {
    return this.iconService.getIcon(name, size);
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

    if (this.contactSection) {
      observer.observe(this.contactSection.nativeElement);
    }
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      
      // Simulation d'envoi
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccess = true;
        this.resetForm();
        
        // Masquer le message après 3 secondes
        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);
      }, 1500);
    }
  }

  // Vérifier la validité du formulaire
  isFormValid(): boolean {
    return !!(
      this.formData.name.trim() &&
      this.formData.email.trim() &&
      this.formData.message.trim()
    );
  }

  // Réinitialiser le formulaire
  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
  }
}