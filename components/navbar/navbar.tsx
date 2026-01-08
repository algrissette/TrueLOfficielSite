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
          
          <div className="flex ">

            <ul className="flex justify-start gap-5 m-1 mx-5"   style={{color, fontFamily: font}}> 

                <li className= " text-2xl hover:text-[#4C9AFF]" > 
                    <a href="/">WHAT </a> </li>
                <li className= " text-2xl hover:text-[#4C9AFF]" > 
                    <a href="/">WHO </a> </li>
                <li className= " text-2xl hover:text-[#4C9AFF]" > 
                    <a href="/">WHY </a> </li>
                </ul> 
                </div>

        </div>
    </nav>
    )
}