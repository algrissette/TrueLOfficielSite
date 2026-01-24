import { CiLogin } from "react-icons/ci"

type navBarProps = {
font : string,
color: string

}

export default function NavBar({font, color}: navBarProps){

/*
const fontColor = () =>{ 
    return ` text-[${color}] `
}
const fontFamily = () =>{ 
    return ` text-[ ${font} ] `
}
    const textSpecifics : string = ` font-${font} text-[${color}]  `
*/



    return(
    <nav className="sticky top-0 z-1000"> 
        <div className="flex bg-black w-full ">
          
         <div className="flex justify-between items-center w-full">
  <ul className="flex gap-5 m-1 mx-5" style={{ color, fontFamily: font }}>
    <li className="text-2xl hover:text-[#4C9AFF]"><a href="/What">WHAT</a></li>
    <li className="text-2xl hover:text-[#4C9AFF]"><a href="/Who">WHO</a></li>
    <li className="text-2xl hover:text-[#4C9AFF]"><a href="/Why">WHY</a></li>
  </ul>
  <a href="/Authentication/Login"> 
  <CiLogin className="text-white cursor-pointer hover:text-[#4C9AFF] transition mr-5" size={28} />
  </a>
</div>

        </div>
    </nav>
    )
}