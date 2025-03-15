import { StyleSheet, Text, View } from "react-native";


function ThreeDot({size}){
    return(
        <View style={styles.container}>
            <Text style={[styles.redDot, {height: size, width: size}]}></Text>
            <Text style={[styles.yellowDot, {height: size, width: size}]}></Text>
            <Text style={[styles.greenDot, {height: size, width: size}]}></Text>
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        gap: 8
    },
    redDot: {
        height: 14,
        width: 14,
        backgroundColor: 'red',
        borderRadius: 100,
        
    },
    yellowDot: {
        height: 14,
        width: 14,
        backgroundColor: 'yellow',
        borderRadius: 100,
        
    },
    greenDot: {
        height: 14,
        width: 14,
        backgroundColor: 'green',
        borderRadius: 100,
        
    }
})

export default ThreeDot;