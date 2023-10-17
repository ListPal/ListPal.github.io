import {useRef, useState} from 'react'

const PullToRefresh = ({onRefresh, children}) => {
    const [refreshing, setRefreshing] = useState(false)
    const topref = useRef(null)

    const touchStart = (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const startY = touch.clientY;
          const height = window.innerHeight;
    
          const onMove = (e) => {
            if (e.touches.length === 1) {
              const touch = e.touches[0];
              const deltaY = touch.clientY - startY;
    
              if (deltaY > 0 && deltaY < height * 0.4) {
                // e.preventDefault();
              }
            }
          };
    
          const onTouchEnd = (e) => {
            document.removeEventListener("touchmove", onMove);
            document.removeEventListener("touchend", onTouchEnd);
    
            if (e.touches.length === 0) {
              if (
                e.changedTouches[0].clientY - startY > height * 0.4 &&
                topref.current.getClientRects()[0].y >= 0
              ) {
                console.log(topref.current.getClientRects());
                onRefresh();
              }
            }
          };
    
          document.addEventListener("touchmove", onMove);
          document.addEventListener("touchend", onTouchEnd);
        }
      };
    return (
    <div onTouchStart={touchStart} ref={topref} style={{marginTop: '-40px', paddingTop:'40px'}}>
        {children}
    </div>
  )
}

export default PullToRefresh