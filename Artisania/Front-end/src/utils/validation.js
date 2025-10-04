export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]+$/
  return phoneRegex.test(phone) && phone.length >= 8
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

export const validateMinLength = (value, minLength) => {
  return value && value.trim().length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return value && value.trim().length <= maxLength
}

export const validatePrice = (price) => {
  const numPrice = parseFloat(price)
  return !isNaN(numPrice) && numPrice >= 0.01 && numPrice <= 999999.99
}

export const validateStock = (stock) => {
  const numStock = parseInt(stock)
  return !isNaN(numStock) && numStock >= 0 && numStock <= 999999
}

export const validateFileSize = (file, maxSizeMB = 5) => {
  return file && file.size <= maxSizeMB * 1024 * 1024
}

export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) => {
  return file && allowedTypes.includes(file.type)
}

export const validateURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateProductForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.name)) {
    errors.name = 'Le nom du produit est requis'
  } else if (!validateMaxLength(formData.name, 100)) {
    errors.name = 'Le nom ne peut pas dépasser 100 caractères'
  }

  if (!validateRequired(formData.description)) {
    errors.description = 'La description est requise'
  } else if (!validateMaxLength(formData.description, 1000)) {
    errors.description = 'La description ne peut pas dépasser 1000 caractères'
  }

  if (!validatePrice(formData.price)) {
    errors.price = 'Le prix doit être entre 0.01 et 999999.99'
  }

  if (!validateRequired(formData.category)) {
    errors.category = 'La catégorie est requise'
  }

  if (formData.stock && !validateStock(formData.stock)) {
    errors.stock = 'Le stock doit être entre 0 et 999999'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateShopForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.name)) {
    errors.name = 'Le nom de la boutique est requis'
  } else if (!validateMaxLength(formData.name, 100)) {
    errors.name = 'Le nom ne peut pas dépasser 100 caractères'
  }

  if (!validateRequired(formData.description)) {
    errors.description = 'La description est requise'
  } else if (!validateMaxLength(formData.description, 1000)) {
    errors.description = 'La description ne peut pas dépasser 1000 caractères'
  }

  if (!validateRequired(formData.phone)) {
    errors.phone = 'Le téléphone est requis'
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Veuillez entrer un numéro de téléphone valide'
  }

  if (formData.email && !validateEmail(formData.email)) {
    errors.email = 'Veuillez entrer un email valide'
  }

  if (!validateRequired(formData.address?.street)) {
    errors['address.street'] = 'L\'adresse est requise'
  }

  if (!validateRequired(formData.address?.city)) {
    errors['address.city'] = 'La ville est requise'
  }

  if (!validateRequired(formData.address?.country)) {
    errors['address.country'] = 'Le pays est requis'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateRegisterForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.firstName)) {
    errors.firstName = 'Le prénom est requis'
  } else if (!validateMinLength(formData.firstName, 2)) {
    errors.firstName = 'Le prénom doit contenir au moins 2 caractères'
  }

  if (!validateRequired(formData.lastName)) {
    errors.lastName = 'Le nom est requis'
  } else if (!validateMinLength(formData.lastName, 2)) {
    errors.lastName = 'Le nom doit contenir au moins 2 caractères'
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Veuillez entrer un email valide'
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Veuillez entrer un numéro de téléphone valide'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
