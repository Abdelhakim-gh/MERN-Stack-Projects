
function App() {

  return (
    <>
      <main className="max-w-2xl mx-auto flex px-4 gap-8">
        <div className="py-8 flex flex-col justify-center">
          <h1 className="text-4xl font-bold uppercase mb-8">
            <span className="text-5xl ">
              Generate story</span> 
            <br />
            <span className="bg-gradient-to-br from-emerald-300 to-sky-300 bg-clip-text text-transparent">
              From blog url</span>
          </h1>
          <form 
            className="grid gap-2"
            >
            <input 
              className="border-2 border-emerald-700 rounded-full bg-transparent text-white px-4 py-2" 
              type="url" 
              placeholder='https://...'
            />
            <button 
              className="bg-emerald-600 text-white px-4 py-2 grow rounded-full uppercase"
              type="submit"
            > Generate video
            </button>
          </form>
        </div>
        <div className="py-4">
          <div className="bg-gray-200 w-[240px] h-[380px] text-gray-500 rounded-2xl p-8">
            video here
          </div>
        </div>
      </main>
      {/* <section>
        <div>
          <ul>
            <li>copy blog url</li>
            <li>generate video</li>
            <li>download</li>
            <li>enjoy</li>
          </ul>
        </div>
      </section> */}
    </>
  )
}

export default App
