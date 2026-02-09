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

  /** Email où recevoir les messages du formulaire */
  readonly contactEmail = 'thioubdjiby96@gmail.com';

  // Soumettre le formulaire : ouvre le client mail avec destinataire thioubdjiby96@gmail.com
  onSubmit(): void {
    if (!this.isFormValid()) return;
    this.isSubmitting = true;

    const subject = encodeURIComponent(`Contact Portfolio - ${this.formData.name.trim()}`);
    const body = encodeURIComponent(
      `Nom: ${this.formData.name.trim()}\n` +
      `Email: ${this.formData.email.trim()}\n\n` +
      `Message:\n${this.formData.message.trim()}`
    );
    const mailtoUrl = `mailto:${this.contactEmail}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    this.isSubmitting = false;
    this.showSuccess = true;
    this.resetForm();
    setTimeout(() => {
      this.showSuccess = false;
    }, 5000);
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