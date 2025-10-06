// Fonctions utilitaires pour l'application Artisania

// Formater un prix en MAD
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD'
  }).format(price);
};

// Formater une date en français
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Tronquer un texte
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Générer un slug à partir d'un texte
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};


// Vérifier si un utilisateur peut modifier un élément
export const canUserModify = (userId, ownerId, userRole) => {
  return userId === ownerId || userRole === 'admin';
};

// Formater un numéro de téléphone marocain
export const formatMoroccanPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('212')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+212${cleaned.substring(1)}`;
  }
  return `+212${cleaned}`;
};

// Valider une image
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Type de fichier non autorisé' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Fichier trop volumineux (max 5MB)' };
  }
  
  return { valid: true };
};
