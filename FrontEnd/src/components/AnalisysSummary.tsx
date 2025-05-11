import { Link } from "react-router-dom"
import { ButtonCustom } from "./Buttons"
import StatsAnalysisSummary from "./StatsAnalysisSummary"

function ResumenAnalisis() {
    return (
        <>
            <div className="mt-5 w-8/14 h-full rounded-2xl bg-darkPrimaryPurple font-primary border-2 border-darkSecondaryPurple shadow-lg">
                <div className="h-11/12 flex flex-col items-center justify-center mt-5">
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
                                width="280px"
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