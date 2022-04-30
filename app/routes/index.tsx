export default function Index() {
  return (
   <div className="container-fluid">
       <div className={'row justify-content-center pt-4'}>
           <div className={'col-7'}>
           <div className={'card p-3'}>
               <h3>Home Page</h3>
               <img src={'https://picsum.photos/200'} className={'w-100'} style={{maxHeight: '500px'}}/>
               <p>Welcome to the MERN Skeleton Home Page</p>
           </div>
           </div>
       </div>
   </div>
  );
}
