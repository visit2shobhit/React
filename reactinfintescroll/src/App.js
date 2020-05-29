import React, {useState,useRef,useCallback} from 'react';
import useBookSearch from './useBookSearch'
const centerAlign = {
  margin: 'auto',
  align:'center',
  padding: '25px',
  color: "red"
}

const loadingClass = {
  color: "black",
}



export default function App(){

  function handleSearch(e){
    setQuery(e.target.value)
    setPageNumber(1)
  
  } 

  const [query,setQuery] = useState('')
  const [pageNumber,setPageNumber] = useState(1)
  const observer = useRef()
  
  const {
    loading,
    error,
    books,
    hasMore
  } = useBookSearch(query,pageNumber)
  const lastBookElementRef = useCallback(node=>{
    if(loading) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries=> {
      if(entries[0].isIntersecting && hasMore){
        setPageNumber(prevPageNumber => prevPageNumber+1)
      }
    })
    if(node) observer.current.observe(node)
  }, [loading, hasMore])

  return(
    <div style={centerAlign}>
    <input type="text" value={query} onChange={handleSearch}></input>
    {
      books.map((book,index)=>{
        if(books.length === index+1){
          return <div ref={lastBookElementRef} key ={book}>{book}</div>
        }
        else{
          return <div key ={book}>{book}</div>
        }
      })
    }
    <div style={loadingClass}>{loading && 'Loading...'}</div>
    <div>{error && 'Error...'}</div>
    </div>
  )
}

// Source : https://www.youtube.com/watch?v=NZKUirTtxcg