import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import api from '../services/api'

const ImageUpload = ({ 
  onImageUploaded, 
  existingImage, 
  label, 
  aspectRatio = 'square',
  maxSize = 5 // MB
}) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(existingImage || '')
  const [error, setError] = useState('')

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()

      // Determine upload endpoint and field name based on label
      let endpoint = '/upload/product/images'
      let fieldName = 'images'
      
      if (label.includes('logo')) {
        endpoint = '/upload/shop/logo'
        fieldName = 'logo'
      } else if (label.includes('banner')) {
        endpoint = '/upload/shop/banner'
        fieldName = 'banner'
      }

      formData.append(fieldName, file)

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const imageUrl = response.data.imageUrl || response.data.images?.[0]?.url
      setPreview(imageUrl)
      onImageUploaded(imageUrl)
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    onImageUploaded('')
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'banner':
        return 'aspect-[3/1]'
      case 'logo':
        return 'aspect-square'
      default:
        return 'aspect-square'
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className={`relative ${getAspectRatioClass()} w-full max-w-md`}>
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
              <p className="mb-2 text-sm text-gray-500">
                {uploading ? 'Uploading...' : 'Click to upload'}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to {maxSize}MB
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default ImageUpload
