import { Link } from "react-router-dom"
import { ButtonCustom } from "./Buttons"
import StatsAnalysisSummary from "./StatsAnalysisSummary"

function ResumenAnalisis() {
    return (
        <>
            <div className="mt-5 h-full w-12/15 rounded-2xl bg-darkPrimaryPurple2 font-primary border-1 border-white shadow-lg">
                <div className="flex flex-col items-center justify-center mt-5">
                    <StatsAnalysisSummary />
                    <div className="flex justify-end mt-4 mr-4 mb-3">
                        <Link to="/analisis">
                            <ButtonCustom
                                type="button"
                                text="Ver análisis completo"
                                onClick={() => { }}
                                isGradient={true}
                                gradientDirection="to bottom"
                                gradientColors={['#E9D7F9', '#774CFB']}
                                color="#400CC2"
                                hoverColor="#E9D7F9"
                                hoverBackground="#774CFB"
                                width="580px"
                                height="35px"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResumenAnalisis