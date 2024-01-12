import { useEffect } from "react"

export function useKey(key, action){
    // for esc key 
  useEffect(function(){
    function callback(e){
      if(e.code.toLowerCase() === key.toLowerCase()){
        action()
      }
    }

    document.addEventListener('keydown', callback)

    return function(){
      document.removeEventListener('keydown', callback)
    }
  }, [action, key])
}