import React, { useEffect, useState } from 'react';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion'
import NewJob from './components/NewJob';
import { Job } from './other/types';
import { useLocalStorage } from './hooks/useLocalStorage';
import ActiveJob from './components/ActiveJob';
import ToastIcon from './components/ToastIcon';
import IconButton from './components/IconButton';
import { faAdd, faHomeAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ToastContainer from './components/ToastContainer';


const testing:boolean = true

function App() {
  const emptyJobs: Job[] = []
  const [background, setBackground] = useState<chrome.runtime.Port | null>(testing? null : chrome.runtime.connect({name: "localToast "}))
  const [jobs, setJobs] = useLocalStorage<Job[]>("JOBS", []) 
  const [activeJob, setActiveJob] = useState<Job>()
  const [showNewJob, setShowNewJob] = useState(false)
  const [showJob, setShowJob] = useState(false)
  const [showMain, setShowMain] = useState(true)
  const [isPulsing, setIsPulsing] = useState(false)
  // sets up extention port to recieve messages from background
  useEffect(() => {  
      if (background){
        background.postMessage({
          action: 'pair-local-toast-with-tab',
          tabId: chrome.devtools.inspectedWindow.tabId
      });
      }

      //recieves messages sent to the port from background
      chrome.runtime && chrome.runtime.onMessage.addListener(
          function(message, sender, sendResponse) {
            console.log("REACT LOCAL TOAST RECIVED: " , message)
              switch (message.action){}
               
      });
  }, []);


  function addJob(newJob:Job){
    setJobs([...jobs, newJob])
  }

  function getJobById(id:string){
    setActiveJob(jobs.find(job => job.id == id))
    setShow("Job")
  }

  function removeJob(id: string){
    setJobs(previousJobs => previousJobs.filter(job => job.id !== id));
  }

  function setShow(page:string){
    setShowJob(false)
    setShowMain(false)
    setShowNewJob(false)

    switch (page){
      case "Job":
        setShowJob(true)
        break
      case "NewJob":
        setShowNewJob(true)
        break
      default:
        setShowMain(true)
    }
  }
  

return (
    <div className="App">
       <ToastIcon isPulsing={isPulsing}/>
       <br/>
       <IconButton icon={faHomeAlt} onClick={()=>setShow("Main")} label=''/>
       <h1>localtoast:3000</h1>
      <AnimatePresence mode='wait'>
              {showMain &&
              <motion.div 
              className='Center'
              key='main-page'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: 200, transition: { duration: 0.5 } }}
              transition={{ duration: 1 }}>
                <IconButton icon={faPlusCircle} label='Add a Job' onClick={()=>setShow("NewJob")}/>


                <h3>Jobs:</h3>

                {jobs.map(job => {
                      return (
                        <ToastContainer onClick={()=>getJobById(job.id)}>
                          <div onClick={()=>getJobById(job.id)}>
                            <h3>{job.title}</h3>
                            <h4># Tasks: {job.elementEvents.length}</h4>
                            <h5>Made for: {job.url}</h5>
                          </div>
                        </ToastContainer>
                      )
                })}
                </motion.div>}

              {showNewJob &&
                  <motion.div 
                      key='new-job'
                      className='Center'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: 200, transition: { duration: 0.5 } }}
                      transition={{ duration: 1 }}>

                      <NewJob toggleToast={setIsPulsing} onClose={()=>{setShow("Main")}} addJob={addJob}/>
                      
                      
                  </motion.div>}

            

              {showJob &&
                  <motion.div 
                      key='active-job'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: 200, transition: { duration: 0.5 } }}
                      transition={{ duration: 1 }}>
                      <ActiveJob job={activeJob!} onClose={()=>setShow("Main")}/>        
                  </motion.div>}
          </AnimatePresence>
    </div>
  );
}

export default App;
