import React, { useEffect, useState } from 'react'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import Modal from "react-modal"
import AddEditNotes from './AddEditNotes'
import {useSelector} from 'react-redux'
import {useNavigate} from "react-router-dom"
import Navbar from "../../components/Navbar"
import axios from 'axios'
import { toast } from 'react-toastify'
import EmptyCard from '../../components/EmptyCard/EmptyCard'

const Home = () => {
  const {currentUser,loading,errorDispatch}=useSelector(
    (state)=>state.user
  )

  const [userInfo,setUserInfo] = useState(null)
  const [allNotes,setAllNotes] = useState([])

  const [isSearch,setIsSearch] = useState(false)

  const navigate = useNavigate()
  const [openAddEditModal,setOpenAddEditModal]=useState({
    isShown:false,
    type:"add",
    data:null,
  })
  useEffect(()=>{
    if(currentUser === null || !currentUser){
       navigate("/login")
    }
    else{
      setUserInfo(currentUser?.rest)
      getAllNotes()
    }
  },[])

  //  get all notes
  const getAllNotes = async()=>{
    try {
      const res=await axios.get("http://localhost:3000/api/note/all",{withCredentials:true})
      if(res.data.success === false){
        console.log(res.data.message)
        return
      }

      setAllNotes(res.data.notes)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (noteDetails) =>{
    setOpenAddEditModal({isShown:true,data:noteDetails,type:"edit"})
  }

  // Delete Note
  const deleteNote = async(data) =>{
    const noteId = data._id

    try {
      const res=await axios.delete("http://localhost:3000/api/note/delete/"+noteId,
        {withCredentials:true}
      )
      if(res.data.success === false){
        toast.error(res.data.message)
        return 
      }
      toast.success(res.data.message)
      getAllNotes()
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  const onSearchNote = async(query)=>{
    try {
      const res = await axios.get("http://localhost:3000/api/note/search",
        {params:{query},
        withCredentials:true
      })

      if(res.data.success === false){
        console.log(res.data.message)
        toast.error(res.data.message)
        return
      }
      setIsSearch(true)
      setAllNotes(res.data.notes)
    } catch (error) {
      toast.error(error.message)
    }
  }
  const handleClearSearch = ()=>{
    setIsSearch(false)
    getAllNotes()
  }
   
  const updateIsPinned = async(noteData)=>{
    const noteId = noteData._id
  
    try {
      const res= await axios.put("http://localhost:3000/api/note/update-note-pinned/"+noteId,
        {isPinned: !noteData.isPinned},{withCredentials:true}
      )
      if(res.data.success === false){
        toast.error(res.data.message)
        console.log(res.data.message)
        return 
      }
      toast.success(res.data.message)
      getAllNotes()
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }

  }
  
  return (
    <>
     <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
    <div className='container mx-auto'>
      {allNotes.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ml-16 mr-16 mt-8 max-md:m-5'>
        {allNotes.map((note,index)=>(
         <NoteCard 
          key={note._id}
          title={note.title}
          date={note.createdAt}
          content={note.content}
          tags={note.tags}
          isPinned={note.isPinned}
          onEdit={()=>{
           handleEdit(note)
          }}
          onDelete={()=>{
           deleteNote(note)
          }}
          onPinNote={()=>{
            updateIsPinned(note)
          }}
         />
        ))}  
       </div>
      ): <EmptyCard imgSrc={ isSearch ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzGPCAYeIK_QsSKlu3PxLVpjiP5g8c4NQlXg&s" 
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPcP5UOUNwzkzPiDiSKW5NrUWBBL81p5Q43Q&s"} 
      message={ isSearch ?  "Oops! No Notes found matching your search" :  `Click the 'Add' button to start noting down your thoughts,
        inspiration and reminders.Let's get Started!`}/>}
    </div>


    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 botttom-10'
      onClick={()=>{
      setOpenAddEditModal({isShown:true,type:"add",data:null})

      }}>
      <MdAdd className='text-[32px] text-white' />
    </button>

    <Modal isOpen={openAddEditModal.isShown} onRequestClose={()=>{}} style={{
      overlay:{
        backgroundColor:"rgba(0,0,0,0.2)"
      }
    }}
    contentLabel=""
    className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
    >
      <AddEditNotes 
      onClose={()=>setOpenAddEditModal({isShown:false,type:"add",data:null})}
      noteData={openAddEditModal.data}
      type={openAddEditModal.type}
      getAllNotes={getAllNotes}      
      />
    </Modal>
    </>
    
  )
}

export default Home
