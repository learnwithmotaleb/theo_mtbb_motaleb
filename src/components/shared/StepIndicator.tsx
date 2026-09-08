import { StepIndecatorFillIcon } from '@/assets/icons/common_icon/StepIndecatorFillIcon';
import { StepIndecatorIcon } from '@/assets/icons/common_icon/StepIndecatorIcon';
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { hp } from '../../../utils/responsiveDevice';

interface StepIndicatorProps {
    totalSteps?: number;
    currentStep: number;
    activeColor?: string;
    inactiveColor?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
    totalSteps = 4,
    currentStep,
    activeColor = Colors.COLOR_ACTIVE,
    inactiveColor = Colors.COLOR_ACTIVE,
}) => {
    return (
        <View style={styles.row}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNumber = index + 1;
                const isDone = stepNumber <= currentStep;
                
                
                const isLineActive = stepNumber < currentStep;

                return (
                    <React.Fragment key={index}>
                        {isDone ? (
                            <StepIndecatorFillIcon size={24} color={activeColor} />
                        ) : (
                            <StepIndecatorIcon size={20} color={inactiveColor} />
                        )}
                        
                      
                        {index < totalSteps - 1 && (
                            <View 
                                style={[
                                    styles.line, 
                                    { backgroundColor: isLineActive ? activeColor : inactiveColor }
                                ]} 
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        width: '100%',            
        paddingHorizontal: hp(20), 
        marginBottom: hp(24),
    },
    line: {
        flex: 1,
        height: hp(0.2), 
        // marginHorizontal: hp(4), 
    },
});