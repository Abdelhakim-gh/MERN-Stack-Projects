import { IKUpload, IKContext, IKImage } from 'imagekitio-react';
import { useRef } from 'react';

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator =  async () => {
    try {
        const response = await fetch('http://localhost:3001/api/upload');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

function Upload({setImage}) {

  const onError = err => {
      console.log("Error", err);  
  };

  const onSuccess = res => {
    console.log("Success", res);
    setImage(prev => ({...prev, isLoading: false, db_data: res}))
  };

  const onUploadProgress = progress => {
    console.log("Progress", progress);
  };

  const onUploadStart = evt => {
    console.log("Start", evt);
    const file = evt.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage((prev) => ({
        ...prev, 
        isLoading: true, 
        ai_data: {
          inilineData: {
            data: reader.result.split(",")[1], 
            mimeType: file.type,
          }
      }}))
    }
    reader.readAsDataURL(file)
    // // setImage({ isLoading: true, error: "" });
    // setImage(prev => ({...prev, isLoading: true}))
  };

  const uploadRef = useRef(null)

  return (
    <>
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        {/* ...client side upload component goes here */}
        <IKUpload
          fileName="test-upload.png"
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          useUniqueFileName={true}
          style={{display: "none"}}
          ref={uploadRef}
        />
        <label onClick={() => uploadRef.current.click()} htmlFor="">
          <img src="/attachment.png" alt="" />
        </label>
      </IKContext>
      {/* ...other SDK components added previously */}
    </>
  );
}

export default Upload;