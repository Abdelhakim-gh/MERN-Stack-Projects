import './NewPrompt.css'
import { useEffect, useRef, useState } from 'react'
import Upload from '../uploads/Upload'
import { IKImage } from 'imagekitio-react'

function NewPrompt() {

    const endRef = useRef(null)
    
    const [image, setImage] = useState({
      isLoading: false,
      error: "",
      db_data: {}
    })

    useEffect(() => {
      endRef.current.scrollIntoView({ behavior: 'smooth' })
    })

  return (
    <>
      {image.isLoading && <div className="">Loading...</div>}
      {image.db_data?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={image.db_data?.filePath}
          width="300"
          transformation={{width: 300}}
        />
      )}
      <div className="end-chat" ref={endRef}></div>
      <div className="new-from">
          <Upload setImage={setImage} />
          {/* <label htmlFor="file">
              <img src="/attachment.png" alt="" />
          </label> */}
          <input type="file" id='file' multiple={false} hidden />
          <input type="text" placeholder='Ask anything...' />
          <button>
              <img src="/arrow.png" alt="" />
          </button>
      </div>
    </>
  )
}

export default NewPrompt