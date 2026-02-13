/**
 * Composable for organized local storage management
 * Handles saving and retrieving images, videos, and data with optimization
 * Organized by namespaces: mannequins, presentations, videos
 */

// Storage namespaces
const STORAGE_NAMESPACES = {
  MANNEQUINS: 'mannequin',
  PRESENTATIONS: 'presentation',
  VIDEOS: 'video',
  STORYTELLING: 'storytelling',
}

// Storage prefixes
const PREFIXES = {
  MANNEQUIN_DATA: `${STORAGE_NAMESPACES.MANNEQUINS}_data_`,
  MANNEQUIN_FULLBODY: `${STORAGE_NAMESPACES.MANNEQUINS}_fullbody_`,
  MANNEQUIN_FACE_THUMB: `${STORAGE_NAMESPACES.MANNEQUINS}_face_thumb_`,
  PRESENTATION_DATA: `${STORAGE_NAMESPACES.PRESENTATIONS}_data_`,
  PRESENTATION_IMAGE: `${STORAGE_NAMESPACES.PRESENTATIONS}_image_`,
  PRESENTATION_PRODUCT: `${STORAGE_NAMESPACES.PRESENTATIONS}_product_`,
  VIDEO_DATA: `${STORAGE_NAMESPACES.VIDEOS}_data_`,
  VIDEO_FILE: `${STORAGE_NAMESPACES.VIDEOS}_file_`,
  STORYTELLING_IMAGE: `${STORAGE_NAMESPACES.STORYTELLING}_image_`,
}

export const useLocalStorage = () => {
  // Get current localStorage usage
  const getStorageUsage = () => {
    try {
      let total = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length
        }
      }
      const usedMB = total / (1024 * 1024)
      const limitMB = 5 // Conservative estimate for most browsers
      const percentage = (usedMB / limitMB) * 100
      
      return {
        used: total,
        usedMB: usedMB.toFixed(2),
        limitMB,
        percentage: percentage.toFixed(1),
        availableMB: (limitMB - usedMB).toFixed(2),
      }
    } catch (error) {
      console.error('Error calculating storage usage:', error)
      return { used: 0, usedMB: '0', limitMB: 5, percentage: '0', availableMB: '5.00' }
    }
  }

  // Get storage usage by namespace
  const getStorageUsageByNamespace = () => {
    const usage = {
      mannequins: { count: 0, sizeMB: 0 },
      presentations: { count: 0, sizeMB: 0 },
      videos: { count: 0, sizeMB: 0 },
      other: { count: 0, sizeMB: 0 },
    }

    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const size = (localStorage[key].length + key.length) / (1024 * 1024)
          
          if (key.startsWith(PREFIXES.MANNEQUIN_DATA) || 
              key.startsWith(PREFIXES.MANNEQUIN_FULLBODY) || 
              key.startsWith(PREFIXES.MANNEQUIN_FACE_THUMB)) {
            usage.mannequins.count++
            usage.mannequins.sizeMB += size
          } else if (key.startsWith(PREFIXES.PRESENTATION_DATA) || 
                     key.startsWith(PREFIXES.PRESENTATION_IMAGE) || 
                     key.startsWith(PREFIXES.PRESENTATION_PRODUCT)) {
            usage.presentations.count++
            usage.presentations.sizeMB += size
          } else if (key.startsWith(PREFIXES.VIDEO_DATA) || 
                     key.startsWith(PREFIXES.VIDEO_FILE)) {
            usage.videos.count++
            usage.videos.sizeMB += size
          } else {
            usage.other.count++
            usage.other.sizeMB += size
          }
        }
      }

      // Round sizes
      Object.keys(usage).forEach(namespace => {
        usage[namespace].sizeMB = parseFloat(usage[namespace].sizeMB.toFixed(2))
      })

      return usage
    } catch (error) {
      console.error('Error calculating storage usage by namespace:', error)
      return usage
    }
  }

  // Compress and resize image before saving
  const compressImage = (imageData, maxWidth = 1920, maxHeight = 1920, quality = 0.75) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        try {
          // Calculate new dimensions
          let width = img.width
          let height = img.height

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = width * ratio
            height = height * ratio
          }

          // Create canvas and draw resized image
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to JPEG with compression (smaller than PNG)
          const compressed = canvas.toDataURL('image/jpeg', quality)
          if (!compressed || compressed === 'data:,') {
            reject(new Error('Failed to compress image: empty result'))
            return
          }
          resolve(compressed)
        } catch (error) {
          reject(error)
        }
      }
      img.onerror = (error) => {
        reject(new Error('Failed to load image for compression: ' + (error.message || 'Unknown error')))
      }
      img.src = imageData
    })
  }

  // Compress video (convert to more efficient format if possible)
  const compressVideo = async (videoData, maxSizeMB = 10) => {
    try {
      // If it's already a data URL, check size
      if (videoData.startsWith('data:')) {
        const sizeInMB = new Blob([videoData]).size / (1024 * 1024)
        if (sizeInMB <= maxSizeMB) {
          return videoData // Already within size limit
        }
      }

      // For videos, we can't compress much without re-encoding
      // Just return the original data
      // In a production app, you might want to use a video compression library
      return videoData
    } catch (error) {
      console.error('Error compressing video:', error)
      return videoData
    }
  }

  // Save image to localStorage with compression
  const saveImage = async (key, imageData, options = {}) => {
    try {
      // Validate imageData
      if (!imageData || typeof imageData !== 'string') {
        console.error('Invalid imageData provided to saveImage')
        return false
      }

      // Default options
      const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 0.75,
        compress = true
      } = options

      // Check storage usage before saving
      const usage = getStorageUsage()
      if (parseFloat(usage.usedMB) > 4) {
        console.warn('Storage usage is high, cleaning old items...')
        cleanOldItems()
      }

      let dataUrl = imageData
      
      // Ensure imageData is a valid data URL
      if (!imageData.startsWith('data:')) {
        // Assume it's base64 PNG if no prefix
        dataUrl = `data:image/png;base64,${imageData}`
      }
      
      // Compress image if needed
      if (compress) {
        try {
          const compressed = await compressImage(dataUrl, maxWidth, maxHeight, quality)
          if (compressed && compressed.startsWith('data:')) {
            dataUrl = compressed
            console.log(`Image compressed: ${key}`)
          } else {
            console.warn('Compression returned invalid data, using original')
          }
        } catch (compressError) {
          console.warn('Failed to compress image, saving original:', compressError)
        }
      }
      
      // Validate dataUrl before saving
      if (!dataUrl || !dataUrl.startsWith('data:')) {
        console.error('Invalid data URL format, cannot save')
        return false
      }
      
      // Check final image size
      const sizeInBytes = new Blob([dataUrl]).size
      const sizeInMB = sizeInBytes / (1024 * 1024)
      
      if (sizeInMB > 2) {
        console.warn(`Image size is still ${sizeInMB.toFixed(2)}MB after compression`)
        // Try more aggressive compression
        if (compress) {
          try {
            dataUrl = await compressImage(dataUrl, maxWidth * 0.8, maxHeight * 0.8, quality * 0.8)
            const newSize = new Blob([dataUrl]).size / (1024 * 1024)
            console.log(`Re-compressed to ${newSize.toFixed(2)}MB`)
          } catch (e) {
            console.warn('Re-compression failed:', e)
          }
        }
      }
      
      // Save to localStorage
      localStorage.setItem(key, dataUrl)
      
      // Verify the image was saved correctly
      const savedImage = localStorage.getItem(key)
      if (!savedImage || savedImage !== dataUrl) {
        console.error('Image was not saved correctly to localStorage')
        return false
      }
      
      console.log(`Image saved: ${key} (${sizeInMB.toFixed(2)}MB)`)
      return true
    } catch (error) {
      console.error('Error saving image to localStorage:', error)
      
      // If quota exceeded, try to clean old items more aggressively
      if (error.name === 'QuotaExceededError' || error.message?.includes('QuotaExceeded')) {
        console.warn('LocalStorage quota exceeded, cleaning old items aggressively...')
        cleanOldItems(true) // Aggressive cleanup
        
        // Try again with more compression
        try {
          let dataUrlToSave = imageData
          if (!imageData.startsWith('data:')) {
            dataUrlToSave = `data:image/png;base64,${imageData}`
          }
          
          // Try to compress with more aggressive settings
          try {
            dataUrlToSave = await compressImage(dataUrlToSave, 1280, 1280, 0.6)
          } catch (compressErr) {
            console.warn('Compression failed, saving original:', compressErr)
          }
          
          localStorage.setItem(key, dataUrlToSave)
          
          // Verify save
          const savedImage = localStorage.getItem(key)
          if (!savedImage) {
            throw new Error('Image not saved after cleanup')
          }
          
          console.log('Image saved successfully after aggressive cleanup and compression')
          return true
        } catch (retryError) {
          console.error('Error saving after cleanup:', retryError)
          throw new Error('LocalStorage may be full. Please clear browser data or remove old items.')
        }
      }
      
      throw error
    }
  }

  // Save video to localStorage
  const saveVideo = async (key, videoData, options = {}) => {
    try {
      // Validate videoData
      if (!videoData || typeof videoData !== 'string') {
        console.error('Invalid videoData provided to saveVideo')
        return false
      }

      const { compress = false, maxSizeMB = 10 } = options

      // Check storage usage before saving
      const usage = getStorageUsage()
      if (parseFloat(usage.usedMB) > 4) {
        console.warn('Storage usage is high, cleaning old items...')
        cleanOldItems()
      }

      let dataUrl = videoData
      
      // Ensure videoData is a valid data URL
      if (!videoData.startsWith('data:')) {
        // Assume it's base64 MP4 if no prefix
        dataUrl = `data:video/mp4;base64,${videoData}`
      }

      // Compress video if requested (limited compression possible)
      if (compress) {
        try {
          dataUrl = await compressVideo(dataUrl, maxSizeMB)
        } catch (compressError) {
          console.warn('Failed to compress video, saving original:', compressError)
        }
      }
      
      // Check video size
      const sizeInBytes = new Blob([dataUrl]).size
      const sizeInMB = sizeInBytes / (1024 * 1024)
      
      if (sizeInMB > maxSizeMB) {
        console.warn(`Video size is ${sizeInMB.toFixed(2)}MB, which exceeds the limit of ${maxSizeMB}MB`)
        // For videos, we might want to warn the user or use a different storage solution
      }
      
      // Save to localStorage
      localStorage.setItem(key, dataUrl)
      
      // Verify the video was saved correctly
      const savedVideo = localStorage.getItem(key)
      if (!savedVideo || savedVideo !== dataUrl) {
        console.error('Video was not saved correctly to localStorage')
        return false
      }
      
      console.log(`Video saved: ${key} (${sizeInMB.toFixed(2)}MB)`)
      return true
    } catch (error) {
      console.error('Error saving video to localStorage:', error)
      
      // If quota exceeded, try to clean old items
      if (error.name === 'QuotaExceededError' || error.message?.includes('QuotaExceeded')) {
        console.warn('LocalStorage quota exceeded, cleaning old items...')
        cleanOldItems(true)
        
        // Try again
        try {
          localStorage.setItem(key, videoData)
          console.log('Video saved successfully after cleanup')
          return true
        } catch (retryError) {
          console.error('Error saving after cleanup:', retryError)
          throw new Error('LocalStorage may be full. Please clear browser data or remove old items.')
        }
      }
      
      throw error
    }
  }

  // Get image from localStorage
  const getImage = (key) => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error getting image from localStorage:', error)
      return null
    }
  }

  // Get video from localStorage
  const getVideo = (key) => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error getting video from localStorage:', error)
      return null
    }
  }

  // Remove image from localStorage
  const removeImage = (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing image from localStorage:', error)
      return false
    }
  }

  // Remove video from localStorage
  const removeVideo = (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing video from localStorage:', error)
      return false
    }
  }

  // Create thumbnail from image
  const createThumbnail = (imageData, maxWidth = 150, maxHeight = 150) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Se for uma URL externa, converter para base64 primeiro para evitar problemas de CORS
        let imageSrc = imageData
        if (typeof imageData === 'string' && imageData.startsWith('http')) {
          try {
            const response = await fetch(imageData, { mode: 'cors' })
            const blob = await response.blob()
            imageSrc = await new Promise((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result)
              reader.onerror = reject
              reader.readAsDataURL(blob)
            })
          } catch (error) {
            console.warn('Erro ao converter URL para base64, tentando usar diretamente:', error)
            // Se falhar, tentar usar a URL diretamente (pode falhar se não tiver CORS)
          }
        }

        const img = new Image()
        img.crossOrigin = 'anonymous' // Permitir CORS para imagens externas
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            let width = img.width
            let height = img.height

            // Calculate new dimensions
            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height
                height = maxHeight
              }
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)

            const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
            resolve(thumbnail)
          } catch (error) {
            // Se toDataURL falhar (problema de CORS), retornar a imagem original como fallback
            console.warn('Erro ao criar thumbnail, usando imagem original:', error)
            resolve(imageSrc)
          }
        }
        
        img.onerror = (error) => {
          console.error('Erro ao carregar imagem para thumbnail:', error)
          // Se já for base64, retornar como está
          if (typeof imageSrc === 'string' && (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:'))) {
            resolve(imageSrc)
          } else {
            reject(new Error('Erro ao carregar imagem para criar thumbnail'))
          }
        }
        
        img.src = imageSrc
      } catch (error) {
        reject(error)
      }
    })
  }

  // ========== MANNEQUIN METHODS ==========
  
  // Save mannequin data
  const saveMannequinData = (mannequinId, data) => {
    try {
      const key = `${PREFIXES.MANNEQUIN_DATA}${mannequinId}`
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error saving mannequin data:', error)
      return false
    }
  }

  // Get mannequin data
  const getMannequinData = (mannequinId) => {
    try {
      const key = `${PREFIXES.MANNEQUIN_DATA}${mannequinId}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error getting mannequin data:', error)
      return null
    }
  }

  // Get all mannequin IDs
  const getAllMannequinIds = () => {
    try {
      const keys = Object.keys(localStorage)
      const mannequinIds = keys
        .filter(key => key.startsWith(PREFIXES.MANNEQUIN_DATA))
        .map(key => key.replace(PREFIXES.MANNEQUIN_DATA, ''))
      return mannequinIds
    } catch (error) {
      console.error('Error getting mannequin IDs:', error)
      return []
    }
  }

  // Save mannequin full body image
  const saveMannequinFullBody = async (mannequinId, imageData, options = {}) => {
    const key = `${PREFIXES.MANNEQUIN_FULLBODY}${mannequinId}`
    return await saveImage(key, imageData, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.75,
      compress: true,
      ...options
    })
  }

  // Save mannequin face thumbnail
  const saveMannequinFaceThumb = async (mannequinId, imageData, options = {}) => {
    const key = `${PREFIXES.MANNEQUIN_FACE_THUMB}${mannequinId}`
    return await saveImage(key, imageData, {
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.8,
      compress: true,
      ...options
    })
  }

  // Get mannequin full body image
  const getMannequinFullBody = (mannequinId) => {
    const key = `${PREFIXES.MANNEQUIN_FULLBODY}${mannequinId}`
    return getImage(key)
  }

  // Get mannequin face thumbnail
  const getMannequinFaceThumb = (mannequinId) => {
    const key = `${PREFIXES.MANNEQUIN_FACE_THUMB}${mannequinId}`
    return getImage(key)
  }

  // Delete mannequin and all associated data
  const deleteMannequin = (mannequinId) => {
    try {
      localStorage.removeItem(`${PREFIXES.MANNEQUIN_DATA}${mannequinId}`)
      localStorage.removeItem(`${PREFIXES.MANNEQUIN_FULLBODY}${mannequinId}`)
      localStorage.removeItem(`${PREFIXES.MANNEQUIN_FACE_THUMB}${mannequinId}`)
      return true
    } catch (error) {
      console.error('Error deleting mannequin:', error)
      return false
    }
  }

  // ========== PRESENTATION METHODS ==========

  // Save presentation data
  const savePresentationData = (presentationId, data) => {
    try {
      const key = `${PREFIXES.PRESENTATION_DATA}${presentationId}`
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error saving presentation data:', error)
      return false
    }
  }

  // Get presentation data
  const getPresentationData = (presentationId) => {
    try {
      const key = `${PREFIXES.PRESENTATION_DATA}${presentationId}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error getting presentation data:', error)
      return null
    }
  }

  // Get all presentation IDs
  const getAllPresentationIds = () => {
    try {
      const keys = Object.keys(localStorage)
      const presentationIds = keys
        .filter(key => key.startsWith(PREFIXES.PRESENTATION_DATA))
        .map(key => key.replace(PREFIXES.PRESENTATION_DATA, ''))
      return presentationIds
    } catch (error) {
      console.error('Error getting presentation IDs:', error)
      return []
    }
  }

  // Save presentation image
  const savePresentationImage = async (presentationId, imageData, options = {}) => {
    const key = `${PREFIXES.PRESENTATION_IMAGE}${presentationId}`
    return await saveImage(key, imageData, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.75,
      compress: true,
      ...options
    })
  }

  // Save presentation product image
  const savePresentationProduct = async (presentationId, imageData, options = {}) => {
    const key = `${PREFIXES.PRESENTATION_PRODUCT}${presentationId}`
    return await saveImage(key, imageData, {
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.85,
      compress: true,
      ...options
    })
  }

  // Get presentation image
  const getPresentationImage = (presentationId) => {
    const key = `${PREFIXES.PRESENTATION_IMAGE}${presentationId}`
    return getImage(key)
  }

  // Get presentation product image
  const getPresentationProduct = (presentationId) => {
    const key = `${PREFIXES.PRESENTATION_PRODUCT}${presentationId}`
    return getImage(key)
  }

  // Delete presentation and all associated data
  const deletePresentation = (presentationId) => {
    try {
      localStorage.removeItem(`${PREFIXES.PRESENTATION_DATA}${presentationId}`)
      localStorage.removeItem(`${PREFIXES.PRESENTATION_IMAGE}${presentationId}`)
      localStorage.removeItem(`${PREFIXES.PRESENTATION_PRODUCT}${presentationId}`)
      return true
    } catch (error) {
      console.error('Error deleting presentation:', error)
      return false
    }
  }

  // ========== VIDEO METHODS ==========

  // Save video data
  const saveVideoData = (videoId, data) => {
    try {
      const key = `${PREFIXES.VIDEO_DATA}${videoId}`
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error saving video data:', error)
      return false
    }
  }

  // Get video data
  const getVideoData = (videoId) => {
    try {
      const key = `${PREFIXES.VIDEO_DATA}${videoId}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error getting video data:', error)
      return null
    }
  }

  // Get all video IDs
  const getAllVideoIds = () => {
    try {
      const keys = Object.keys(localStorage)
      const videoIds = keys
        .filter(key => key.startsWith(PREFIXES.VIDEO_DATA))
        .map(key => key.replace(PREFIXES.VIDEO_DATA, ''))
      return videoIds
    } catch (error) {
      console.error('Error getting video IDs:', error)
      return []
    }
  }

  // Save video file
  const saveVideoFile = async (videoId, videoData, options = {}) => {
    const key = `${PREFIXES.VIDEO_FILE}${videoId}`
    return await saveVideo(key, videoData, {
      compress: false, // Videos are already compressed
      maxSizeMB: 10,
      ...options
    })
  }

  // Get video file
  const getVideoFile = (videoId) => {
    const key = `${PREFIXES.VIDEO_FILE}${videoId}`
    return getVideo(key)
  }

  // Delete video and all associated data
  const deleteVideo = (videoId) => {
    try {
      localStorage.removeItem(`${PREFIXES.VIDEO_DATA}${videoId}`)
      localStorage.removeItem(`${PREFIXES.VIDEO_FILE}${videoId}`)
      return true
    } catch (error) {
      console.error('Error deleting video:', error)
      return false
    }
  }

  // ========== STORYTELLING METHODS ==========

  // Save storytelling image (imageNumber: 1, 2, or 3)
  const saveStorytellingImage = async (storytellingId, imageNumber, imageData, options = {}) => {
    const key = `${PREFIXES.STORYTELLING_IMAGE}${storytellingId}_${imageNumber}`
    return await saveImage(key, imageData, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.75,
      compress: true,
      ...options
    })
  }

  // Get storytelling image
  const getStorytellingImage = (storytellingId, imageNumber) => {
    const key = `${PREFIXES.STORYTELLING_IMAGE}${storytellingId}_${imageNumber}`
    return getImage(key)
  }

  // Remove storytelling image
  const removeStorytellingImage = (storytellingId, imageNumber) => {
    const key = `${PREFIXES.STORYTELLING_IMAGE}${storytellingId}_${imageNumber}`
    return removeImage(key)
  }

  // ========== CLEANUP METHODS ==========

  // Clean old items (keep only last N items to free up space)
  const cleanOldItems = (aggressive = false) => {
    try {
      const maxItems = aggressive ? 10 : 15 // Keep fewer items if aggressive
      
      // Get all items by type
      const mannequinIds = getAllMannequinIds().map(id => ({ 
        id, 
        type: 'mannequin', 
        timestamp: parseInt(id) || 0 
      }))
      
      const presentationIds = getAllPresentationIds().map(id => ({ 
        id, 
        type: 'presentation', 
        timestamp: parseInt(id) || 0 
      }))
      
      const videoIds = getAllVideoIds().map(id => ({ 
        id, 
        type: 'video', 
        timestamp: parseInt(id) || 0 
      }))
      
      // Combine and sort by timestamp (newest first)
      const allItems = [...mannequinIds, ...presentationIds, ...videoIds]
      allItems.sort((a, b) => b.timestamp - a.timestamp)
      
      // Keep only the most recent items
      const itemsToKeep = allItems.slice(0, maxItems)
      const itemsToRemove = allItems.slice(maxItems)
      
      // Remove old items
      let removedCount = 0
      itemsToRemove.forEach(({ id, type }) => {
        if (type === 'mannequin') {
          deleteMannequin(id)
          removedCount++
        } else if (type === 'presentation') {
          deletePresentation(id)
          removedCount++
        } else if (type === 'video') {
          deleteVideo(id)
          removedCount++
        }
      })
      
      if (removedCount > 0) {
        console.log(`Cleaned up ${removedCount} old items from localStorage (kept ${maxItems} most recent)`)
      }
      
      return removedCount
    } catch (error) {
      console.error('Error cleaning old items:', error)
      return 0
    }
  }

  // Clear all items of a specific type
  const clearNamespace = (namespace) => {
    try {
      let prefix = ''
      if (namespace === 'mannequin') {
        prefix = PREFIXES.MANNEQUIN_DATA
      } else if (namespace === 'presentation') {
        prefix = PREFIXES.PRESENTATION_DATA
      } else if (namespace === 'video') {
        prefix = PREFIXES.VIDEO_DATA
      } else {
        return false
      }

      const keys = Object.keys(localStorage)
      const itemsToRemove = keys.filter(key => key.startsWith(prefix))
      
      itemsToRemove.forEach(key => {
        const id = key.replace(prefix, '')
        if (namespace === 'mannequin') {
          deleteMannequin(id)
        } else if (namespace === 'presentation') {
          deletePresentation(id)
        } else if (namespace === 'video') {
          deleteVideo(id)
        }
      })

      console.log(`Cleared ${itemsToRemove.length} items from ${namespace} namespace`)
      return true
    } catch (error) {
      console.error(`Error clearing ${namespace} namespace:`, error)
      return false
    }
  }

  return {
    // General methods
    saveImage,
    getImage,
    removeImage,
    saveVideo,
    getVideo,
    removeVideo,
    createThumbnail,
    compressImage,
    getStorageUsage,
    getStorageUsageByNamespace,
    cleanOldItems,
    clearNamespace,
    
    // Mannequin methods
    saveMannequinData,
    getMannequinData,
    getAllMannequinIds,
    saveMannequinFullBody,
    saveMannequinFaceThumb,
    getMannequinFullBody,
    getMannequinFaceThumb,
    deleteMannequin,
    
    // Presentation methods
    savePresentationData,
    getPresentationData,
    getAllPresentationIds,
    savePresentationImage,
    savePresentationProduct,
    getPresentationImage,
    getPresentationProduct,
    deletePresentation,
    
    // Video methods
    saveVideoData,
    getVideoData,
    getAllVideoIds,
    saveVideoFile,
    getVideoFile,
    deleteVideo,
    
    // Storytelling methods
    saveStorytellingImage,
    getStorytellingImage,
    removeStorytellingImage,
  }
}
