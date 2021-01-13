import React from 'react';
import PropTypes from 'prop-types';
import {Image, Linking, Platform, SafeAreaView, Text, TouchableOpacity} from 'react-native';

import pkg from '../../../package.json';

import axios from 'axios';
import compareVersions from 'compare-versions';

import {appId, metadataUrl} from '~/Config';
import {styles} from '~/Components/Update/Update.styles';
import Config from 'react-native-config';

const updatePropTypes = {
  children: PropTypes.func.isRequired,
};

export const Update: React.FC<PropTypes.InferProps<typeof updatePropTypes>> = ({children}) => {
  const [loading, setLoading] = React.useState(true);
  const [versions, setVersions] = React.useState({
    hasNewerVersion: false,
    requiresNewerVersion: false,
  });

  React.useEffect(() => {
    (async () => {
      try {
        const {data: metadataResponse} = await axios.get(`${metadataUrl()}/app`);

        const hasNewerVersion = compareVersions.compare(pkg.version, metadataResponse.currentVersion, '<');
        const requiresNewerVersion = compareVersions.compare(pkg.version, metadataResponse.oldestSupportedVersion, '<');

        setVersions({
          hasNewerVersion,
          requiresNewerVersion,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return versions.requiresNewerVersion
    ? (
      <SafeAreaView style={styles.container}>
        <Image
          source={require('~/Assets/newLogoMobile.png')}
          style={styles.logo}
        />

        <Image
          style={styles.image}
          source={
            require('~/Assets/launch.png')
          }
        />

        <Text style={styles.header}>Common just got better</Text>

        <Text style={styles.description}>
          A new version of the Common app is available. Update now to get the latest feature updates and bug fixes.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Config.ENV === 'staging'
                ? Linking.openURL(`https://beta.itunes.apple.com/v1/app/${appId}`)
                : Linking.openURL(`itms-apps://itunes.apple.com/us/app/apple-store/${appId}`);
            } else if (Platform.OS === 'android') {
              Linking.openURL(`market://details?id=${appId}`);
            }
          }}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
    : children(loading);
};

Update.propTypes = updatePropTypes;
