import Authentication from "@/components/Authentication/Authentication";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";

export default function SignUp(){

    return(

        <div>
            <NavBar
                            font= "sans"
                            color="#ffffff"
                            />
            
            <Authentication
            signUp= {false} />

             <Footer/>
        </div>
    )
    
}