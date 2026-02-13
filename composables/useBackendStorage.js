/**
 * Composable for backend storage management
 * Handles saving and retrieving images, videos, and data from backend (GCS + MongoDB)
 * Uses GraphQL API to interact with backend
 */

export const useBackendStorage = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl || 'http://localhost:4000'
  const { user } = useAuth()

  /**
   * Fetch presentations from backend
   */
  const fetchPresentations = async () => {
    try {
      const query = `query MyPresentations {
  myPresentations {
    id
    userId
    productName
    productDescription
    presentationType
    generatedImage
    generatedImageUrl
    productImageUrl
    mannequinId
    metadata {
      handPosition
      modelPose
      expression
      environmentType
      studioBackgroundColor
      indoorEnvironment
      blurBackground
      imageOrientation
    }
    createdAt
    updatedAt
  }
}`
      
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ query }),
      })

      if (response.errors) {
        console.error('GraphQL errors:', response.errors)
        throw new Error(response.errors[0].message)
      }

      return response.data?.myPresentations || []
    } catch (error) {
      console.error('Error fetching presentations:', error)
      throw error
    }
  }

  /**
   * Fetch videos from backend
   */
  const fetchVideos = async () => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query MyVideos {
              myVideos {
                id
                userId
                presentationId
                title
                prompt
                structuredPrompt
                generatedVideo
                generatedVideoUrl
                duration
                resolution
                aspectRatio
                modelType
                generateAudio
                promptData
                createdAt
                updatedAt
              }
            }
          `,
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.myVideos || []
    } catch (error) {
      console.error('Error fetching videos:', error)
      throw error
    }
  }

  /**
   * Get a single presentation by ID
   */
  const getPresentation = async (id) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query GetPresentation($id: ID!) {
              presentation(id: $id) {
                id
                userId
                productName
                productDescription
                presentationType
                generatedImage
                generatedImageUrl
                productImageUrl
                metadata
                createdAt
                updatedAt
              }
            }
          `,
          variables: { id },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.presentation
    } catch (error) {
      console.error('Error fetching presentation:', error)
      throw error
    }
  }

  /**
   * Get a single video by ID
   */
  const getVideo = async (id) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query GetVideo($id: ID!) {
              video(id: $id) {
                id
                userId
                presentationId
                title
                prompt
                structuredPrompt
                generatedVideo
                generatedVideoUrl
                duration
                resolution
                aspectRatio
                modelType
                generateAudio
                promptData
                createdAt
                updatedAt
              }
            }
          `,
          variables: { id },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.video
    } catch (error) {
      console.error('Error fetching video:', error)
      throw error
    }
  }

  /**
   * Delete a presentation
   */
  const deletePresentation = async (id) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation DeletePresentation($id: ID!) {
              deletePresentation(id: $id)
            }
          `,
          variables: { id },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.deletePresentation
    } catch (error) {
      console.error('Error deleting presentation:', error)
      throw error
    }
  }

  /**
   * Delete a video
   */
  const deleteVideo = async (id) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation DeleteVideo($id: ID!) {
              deleteVideo(id: $id)
            }
          `,
          variables: { id },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.deleteVideo
    } catch (error) {
      console.error('Error deleting video:', error)
      throw error
    }
  }

  /**
   * Fetch mannequins from backend
   */
  const fetchMannequins = async () => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query MyMannequins {
              myMannequins {
                id
                userId
                name
                type
                color
                description
                modelType
                imageFormat
                bodyType
                bodyBuild
                bustSize
                bodyDetails
                gender
                generatedImage
                fullBodyImageUrl
                faceThumbnailUrl
                createdAt
                updatedAt
              }
            }
          `,
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.myMannequins || []
    } catch (error) {
      console.error('Error fetching mannequins:', error)
      throw error
    }
  }

  /**
   * Delete a mannequin
   */
  const deleteMannequin = async (id) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation DeleteMannequin($id: ID!) {
              deleteMannequin(id: $id)
            }
          `,
          variables: { id },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.deleteMannequin
    } catch (error) {
      console.error('Error deleting mannequin:', error)
      throw error
    }
  }

  /**
   * Delete a control motion video
   */
  const deleteControlMotionVideo = async (id) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation DeleteControlMotionVideo($id: ID!) {
              deleteControlMotionVideo(id: $id)
            }
          `,
          variables: { id },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.deleteControlMotionVideo
    } catch (error) {
      console.error('Error deleting control motion video:', error)
      throw error
    }
  }

  /**
   * Delete a face swap record
   */
  const deleteFaceSwapRecord = async (id) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation DeleteFaceSwapRecord($id: ID!) {
              deleteFaceSwapRecord(id: $id)
            }
          `,
          variables: { id },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.deleteFaceSwapRecord
    } catch (error) {
      console.error('Error deleting face swap record:', error)
      throw error
    }
  }

  /**
   * Fetch control motion videos from backend
   */
  const fetchControlMotionVideos = async () => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query MyControlMotionVideos {
              myControlMotionVideos {
                id
                userId
                mannequinId
                title
                generatedVideo
                generatedVideoUrl
                resolution
                createdAt
                updatedAt
              }
            }
          `,
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.myControlMotionVideos || []
    } catch (error) {
      console.error('Error fetching control motion videos:', error)
      throw error
    }
  }

  /**
   * Fetch face swap results from backend
   */
  const fetchFaceSwapResults = async () => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query MyFaceSwapResults {
              myFaceSwapResults {
                id
                userId
                resultImageUrl
                createdAt
                updatedAt
              }
            }
          `,
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.myFaceSwapResults || []
    } catch (error) {
      console.error('Error fetching face swap results:', error)
      throw error
    }
  }

  /**
   * Fetch pricing configuration from backend
   */
  const fetchPricing = async () => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query Pricing {
              pricing {
                creditRate
                controlMotion {
                  p720 {
                    pricePerSecond
                    creditsPerSecond
                  }
                  p1080 {
                    pricePerSecond
                    creditsPerSecond
                  }
                }
                veoVideo {
                  fast {
                    base {
                      pricePerSecond
                      creditsPerSecond
                    }
                    withAudio {
                      pricePerSecond
                      creditsPerSecond
                    }
                  }
                  normal {
                    p1080 {
                      base {
                        pricePerSecond
                        creditsPerSecond
                      }
                      withAudio {
                        pricePerSecond
                        creditsPerSecond
                      }
                    }
                    p4k {
                      base {
                        pricePerSecond
                        creditsPerSecond
                      }
                      withAudio {
                        pricePerSecond
                        creditsPerSecond
                      }
                    }
                  }
                }
                gemini {
                  normal {
                    price
                    credits
                  }
                  flash {
                    price
                    credits
                  }
                }
                mannequin {
                  price
                  credits
                }
                presentation {
                  price
                  credits
                }
                storytelling {
                  price
                  credits
                }
              }
            }
          `,
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data?.pricing || null
    } catch (error) {
      console.error('Error fetching pricing:', error)
      throw error
    }
  }

  /**
   * Fetch folders from backend
   */
  const fetchFolders = async () => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query MyFolders {
              myFolders {
                id
                userId
                name
                color
                icon
                files {
                  type
                  fileId
                }
                createdAt
                updatedAt
              }
            }
          `,
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.myFolders || []
    } catch (error) {
      console.error('Error fetching folders:', error)
      throw error
    }
  }

  /**
   * Create a new folder
   */
  const createFolder = async (name, color = '#3b82f6', icon = 'folder') => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation CreateFolder($input: CreateFolderInput!) {
              createFolder(input: $input) {
                id
                userId
                name
                color
                icon
                files {
                  type
                  fileId
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            input: { name, color, icon }
          },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.createFolder
    } catch (error) {
      console.error('Error creating folder:', error)
      throw error
    }
  }

  /**
   * Update a folder
   */
  const updateFolder = async (id, name, color, icon) => {
    try {
      const input = {}
      if (name !== undefined) input.name = name
      if (color !== undefined) input.color = color
      if (icon !== undefined) input.icon = icon

      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation UpdateFolder($id: ID!, $input: UpdateFolderInput!) {
              updateFolder(id: $id, input: $input) {
                id
                userId
                name
                color
                icon
                files {
                  type
                  fileId
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { id, input },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.updateFolder
    } catch (error) {
      console.error('Error updating folder:', error)
      throw error
    }
  }

  /**
   * Delete a folder
   */
  const deleteFolder = async (id) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation DeleteFolder($id: ID!) {
              deleteFolder(id: $id)
            }
          `,
          variables: { id },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.deleteFolder
    } catch (error) {
      console.error('Error deleting folder:', error)
      throw error
    }
  }

  /**
   * Add file to folder
   */
  const addFileToFolder = async (folderId, fileType, fileId) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation AddFileToFolder($folderId: ID!, $fileType: String!, $fileId: ID!) {
              addFileToFolder(folderId: $folderId, fileType: $fileType, fileId: $fileId) {
                id
                userId
                name
                color
                icon
                files {
                  type
                  fileId
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { folderId, fileType, fileId },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.addFileToFolder
    } catch (error) {
      console.error('Error adding file to folder:', error)
      throw error
    }
  }

  /**
   * Remove file from folder
   */
  const removeFileFromFolder = async (folderId, fileType, fileId) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation RemoveFileFromFolder($folderId: ID!, $fileType: String!, $fileId: ID!) {
              removeFileFromFolder(folderId: $folderId, fileType: $fileType, fileId: $fileId) {
                id
                userId
                name
                color
                icon
                files {
                  type
                  fileId
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { folderId, fileType, fileId },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.removeFileFromFolder
    } catch (error) {
      console.error('Error removing file from folder:', error)
      throw error
    }
  }

  /**
   * Fetch approved mannequins from backend
   */
  const fetchApprovedMannequins = async () => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query ApprovedMannequins {
              approvedMannequins {
                id
                userId
                name
                type
                color
                description
                modelType
                imageFormat
                bodyType
                bodyBuild
                bustSize
                bodyDetails
                gender
                generatedImage
                fullBodyImageUrl
                faceThumbnailUrl
                approvedForVitrini
                createdAt
                updatedAt
              }
            }
          `,
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.approvedMannequins || []
    } catch (error) {
      console.error('Error fetching approved mannequins:', error)
      throw error
    }
  }

  /**
   * Fetch presentations by mannequin ID
   */
  const fetchPresentationsByMannequin = async (mannequinId) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query PresentationsByMannequin($mannequinId: ID!) {
              presentationsByMannequin(mannequinId: $mannequinId) {
                id
                userId
                productName
                productDescription
                presentationType
                generatedImage
                generatedImageUrl
                productImageUrl
                mannequinId
                metadata {
                  handPosition
                  modelPose
                  expression
                  environmentType
                  studioBackgroundColor
                  indoorEnvironment
                  blurBackground
                  imageOrientation
                }
                approvedForVitrini
                createdAt
                updatedAt
              }
            }
          `,
          variables: { mannequinId },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.presentationsByMannequin || []
    } catch (error) {
      console.error('Error fetching presentations by mannequin:', error)
      throw error
    }
  }

  /**
   * Fetch videos by mannequin ID
   */
  const fetchVideosByMannequin = async (mannequinId) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query VideosByMannequin($mannequinId: ID!) {
              videosByMannequin(mannequinId: $mannequinId) {
                id
                userId
                presentationId
                mannequinId
                title
                prompt
                structuredPrompt
                generatedVideoUrl
                duration
                resolution
                aspectRatio
                modelType
                generateAudio
                promptData
                approvedForVitrini
                createdAt
                updatedAt
              }
            }
          `,
          variables: { mannequinId },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.videosByMannequin || []
    } catch (error) {
      console.error('Error fetching videos by mannequin:', error)
      throw error
    }
  }

  /**
   * Fetch control motion videos by mannequin ID
   */
  const fetchControlMotionVideosByMannequin = async (mannequinId) => {
    try {
      const response = await $fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query ControlMotionVideosByMannequin($mannequinId: ID!) {
              controlMotionVideosByMannequin(mannequinId: $mannequinId) {
                id
                userId
                mannequinId
                title
                generatedVideo
                generatedVideoUrl
                resolution
                approvedForVitrini
                createdAt
                updatedAt
              }
            }
          `,
          variables: { mannequinId },
        }),
      })

      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      return response.data.controlMotionVideosByMannequin || []
    } catch (error) {
      console.error('Error fetching control motion videos by mannequin:', error)
      throw error
    }
  }

  return {
    fetchPresentations,
    fetchVideos,
    fetchMannequins,
    fetchControlMotionVideos,
    fetchFaceSwapResults,
    fetchPricing,
    fetchFolders,
    getPresentation,
    getVideo,
    deletePresentation,
    deleteVideo,
    deleteMannequin,
    deleteControlMotionVideo,
    deleteFaceSwapRecord,
    createFolder,
    updateFolder,
    deleteFolder,
    addFileToFolder,
    removeFileFromFolder,
    fetchApprovedMannequins,
    fetchPresentationsByMannequin,
    fetchVideosByMannequin,
    fetchControlMotionVideosByMannequin,
  }
}
