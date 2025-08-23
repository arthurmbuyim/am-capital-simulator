'use client';

import { useState } from 'react';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { ContactFormData } from '@/src/lib/types';

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    projectType: 'investment',
    budget: '',
    timeline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Téléphone requis';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulation d'envoi de formulaire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Données du formulaire:', formData);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Message envoyé avec succès !
        </h3>
        <p className="text-gray-600 mb-6">
          Merci pour votre intérêt. Un de nos experts vous contactera 
          dans les plus brefs délais pour discuter de votre projet.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Prochaines étapes :</strong><br />
            • Analyse personnalisée de votre projet<br />
            • Présentation des opportunités disponibles<br />
            • Accompagnement jusqu'à la finalisation
          </p>
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              message: '',
              projectType: 'investment',
              budget: '',
              timeline: ''
            });
          }}
          className="mt-6 text-blue-600 hover:text-blue-700 font-medium"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-am-navy" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-am-navy-text">
            Contactez nos experts
          </h3>
          <p className="text-am-navy-light">
            Obtenez un accompagnement personnalisé
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champs Nom/Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-am-navy-text mb-1">
              Prénom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-am-navy transition-colors ${
                  errors.firstName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-am-navy-light focus:border-blue-500'
                }`}
                placeholder="Votre prénom"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-am-navy-text mb-1">
              Nom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-am-navy transition-colors ${
                  errors.lastName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-am-navy focus:border-am-navy'
                }`}
                placeholder="Votre nom"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Champs Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-am-navy-text mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-am-navy transition-colors ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-am-navy focus:border-am-navy'
                }`}
                placeholder="votre@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-am-navy-text mb-1">
              Téléphone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-am-navy transition-colors ${
                  errors.phone 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-am-navy focus:border-am-navy'
                }`}
                placeholder="06 12 34 56 78"
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Type de projet */}
        <div>
          <label className="block text-sm font-medium text-am-navy-text mb-2">
            Type de projet
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { value: 'investment', label: 'Investissement' },
              { value: 'advice', label: 'Conseil' },
              { value: 'management', label: 'Gestion' },
              { value: 'other', label: 'Autre' }
            ].map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange('projectType', option.value)}
                className={`p-2 text-sm border rounded-lg transition-colors ${
                  formData.projectType === option.value
                    ? 'border-am-navy bg-blue-50 text-am-navy-text'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget et Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-am-navy-text mb-1">
              Budget envisagé
            </label>
            <select
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full p-3 border border-am-navy rounded-lg focus:ring-am-navy focus:border-am-navy">
              <option value="">Sélectionnez une fourchette</option>
              <option value="0-100k">Moins de 100k€</option>
              <option value="100k-250k">100k€ - 250k€</option>
              <option value="250k-500k">250k€ - 500k€</option>
              <option value="500k-1M">500k€ - 1M€</option>
              <option value="1M+">Plus de 1M€</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-am-navy-text mb-1">
              Calendrier souhaité
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className="w-full p-3 border border-am-navy rounded-lg focus:ring-am-navy focus:border-am-navy"
            >
              <option value="">Sélectionnez un délai</option>
              <option value="immediate">Immédiat</option>
              <option value="1-3months">1-3 mois</option>
              <option value="3-6months">3-6 mois</option>
              <option value="6-12months">6-12 mois</option>
              <option value="12months+">Plus de 12 mois</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-am-navy-text mb-1">
            Message *
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-am-navy transition-colors resize-none ${
                errors.message 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-am-navy focus:border-am-navy'
              }`}
              placeholder="Décrivez votre projet ou vos questions..."
            />
          </div>
          {errors.message && (
            <p className="text-red-600 text-xs mt-1">{errors.message}</p>
          )}
        </div>

        {/* Bouton Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-am-navy hover:bg-am-navy-light disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Envoyer le message</span>
            </>
          )}
        </button>

        {/* Notice RGPD */}
        <div className="text-xs text-am-navy-text bg-gray-50 p-3 rounded-lg">
          <p>
            En soumettant ce formulaire, vous acceptez que vos données soient 
            utilisées pour vous recontacter dans le cadre de votre demande. 
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification 
            et de suppression de vos données.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;