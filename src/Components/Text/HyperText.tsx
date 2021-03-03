import React, {ReactElement,ReactNode} from 'react';
import {StyleSheet, Text, TextStyle, View} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import {colors} from '~/Theme';

const styles = StyleSheet.create({
    fullWidth: {
        width: '100%',
    },
    hyperLinkStyle: {
        textDecorationLine: 'underline',
        color: colors.mainBlue,
        backgroundColor: 'yellow',
        flexDirection: 'row',
      },
});

type LinkProps = {
    children: ReactNode,
    linkStyle?: TextStyle,
    textStyle?: TextStyle,
    selectable?: boolean,
}

type Props = LinkProps & {
    isFullWidth?: boolean,
}

function LinkText({children, linkStyle, textStyle, selectable = true} : LinkProps): ReactElement {

    return (
        <Hyperlink linkDefault={true} linkStyle={linkStyle ?? styles.hyperLinkStyle}>
            <Text style={textStyle ?? {}} selectable={selectable}>{children}</Text>
        </Hyperlink>
    );
}

export function HyperText({isFullWidth = false, ...props}: Props): ReactElement {

    if (isFullWidth) {
        return (
            <View style={styles.fullWidth}>
                <LinkText {...props}/>
            </View>
        );
    }

    return <LinkText {...props}/>;
}
