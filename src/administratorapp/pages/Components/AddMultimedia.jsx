/* eslint-disable react/prop-types */
import { Grid, Typography } from '@mui/material'
import { ImagesAdminComponent } from './ImagesAdminComponent'
import { useEffect, useState } from 'react'
import { HomeMultimediaComponent } from './HomeMultimediaComponent'
import ResponsiveDialog from './DialogMuiComponent'
import { startDeleteAImgOfEvent } from '../../../backend/events/EventsThunks'
import swal from 'sweetalert'

function getFilenameFromURL(url) {
  const path = url.split('/')
  const filename = path[path.length - 1].split('?')[0]
  console.log(filename)
  return decodeURIComponent(filename).split('/').pop()
}

// Ejemplo de uso
const url = 'https://firebasestorage.googleapis.com/v0/b/coporeddeh.appspot.com/o/events%2FZISITBA7fHAO7s5oqolb%2F235068201.jpg?alt=media&token=7db52349-e72e-431d-9ab4-749d396a0b14'
const nombreDeArchivo = getFilenameFromURL(url)

console.log(nombreDeArchivo) // Esto debería imprimir "235068201.jpg"

export const AddMultimediaComponent = ({ videos, imagesList = [], addMultimedia, setAddMultimedia, id }) => {
  const [listOfImages, setListOfImages] = useState({ images: imagesList, imagesFiles: [], error: false })
  const [videosList, setVideosList] = useState(videos || addMultimedia.videos || [])
  const [open, setOpen] = useState(false)
  console.log(imagesList)
  console.log(addMultimedia)
  const { images } = listOfImages
  console.log(listOfImages)
  const onImgDelete = (index, imgIndex) => {
    const img = images[index]
    const newListOfImages = images
    newListOfImages.splice(imgIndex, 1)

    if (img.includes('firebase')) {
      const filename = getFilenameFromURL(img)
      console.log(filename)
      Promise.all([startDeleteAImgOfEvent(id, newListOfImages.concat(addMultimedia.videos), filename)])
        .then((res) => {
          const { status } = res[0]
          if (status === 'success') {
            setListOfImages({ images: newListOfImages, imagesFiles: listOfImages.imagesFiles, error: false })
            return swal('Imagen eliminada correctamente', '', 'success')
          }
          return swal('No se pudo eliminar la imagen, intentelo de nuevo.', '', 'error')
        })
        .catch(() =>
          swal('No se pudo eliminar la imagen, intentelo de nuevo.', '', 'error')
        )
      return
    }

    const newListOfImagesFiles = listOfImages.imagesFiles
    newListOfImagesFiles.splice(imgIndex, 1)

    setListOfImages({ images: newListOfImages, imagesFiles: newListOfImagesFiles, error: false })
  }

  const onFileInputClick = (e, index) => {
    const img = e.target.files[0]

    if (img && img.type.substr(0, 5) === 'image') {
      /* eslint-disable-next-line no-undef */
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageBuff = e.target.result
        const urlImg = URL.createObjectURL(new Blob([imageBuff], { type: 'image/*' }))
        const newListOfImages = listOfImages.images
        newListOfImages.push(urlImg)
        console.log('prueba', listOfImages)
        const newListOfImagesFiles = listOfImages.imagesFiles
        newListOfImagesFiles.push(imageBuff)

        setListOfImages({ images: newListOfImages, imagesFiles: newListOfImagesFiles, error: false })
        setAddMultimedia({ ...addMultimedia, imagesFiles: newListOfImagesFiles })
        console.log(listOfImages)
      }

      reader.readAsArrayBuffer(img)
    } else {
      setListOfImages({ images, error: true })
    }
  }

  const setDialogState = (state) => {
    setOpen(state)
    setAddMultimedia({ edit: state, videos: videosList, images: listOfImages.imagesFiles })
  }
  const componentSetVideosList = (newList) => {
    setVideosList(newList)
    setAddMultimedia({ ...addMultimedia, videos: newList })
  }
  useEffect(() => {
    setOpen(addMultimedia.edit)
    setVideosList(addMultimedia.videos)
    setListOfImages({ ...addMultimedia, imagesFiles: [] })
  }, [addMultimedia])

  return (
    <ResponsiveDialog title='Añadir multimedia' state={open} setState={setDialogState} onConfirm={() => { }}>
      <Grid>

        <Grid>
          <HomeMultimediaComponent videosList={videosList} option='envents' setVideosList={componentSetVideosList} />
        </Grid>
        <Grid>
          <Typography variant='h4'>Imagenes</Typography>
          <ImagesAdminComponent images={listOfImages?.images} index={0} onImgDelete={onImgDelete} onFileInputClick={onFileInputClick} />
        </Grid>
      </Grid>
    </ResponsiveDialog>
  )
}
