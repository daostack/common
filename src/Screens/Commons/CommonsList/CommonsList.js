import React, {useState} from 'react';
import {SafeAreaView, SectionList, StyleSheet} from 'react-native';
import {observer} from 'mobx-react';
import {useTimeoutFn} from '../../../Util/hooks/useTimeoutFn';
import Loader from '~/Components/Loader';
import {AddCommonButton} from './add-common-button';
import {CommonItem} from './common-item';
import {useStore} from '~/Stores';
import {CommonListFooter} from './common-list-footer';
import {CommonListSectionHeader} from './common-list-section-header';
import {CommonListLoading} from './common-list-loading';
import {CommonListHeader} from './common-list-header';
import {colors} from '~/Theme';

export const CommonsList = observer(() => {
  const {commonStore} = useStore();
  const [isLoading, setLoading] = useState(true);
  const handleLoader = () => {
    setLoading(false);
  };

  useTimeoutFn(handleLoader, 1500);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {commonStore.isLoading ? (
          <CommonListLoading />
        ) : (
          <SectionList
            sections={commonStore.sections}
            ListHeaderComponent={<CommonListHeader />}
            contentContainerStyle={{paddingHorizontal: 20}}
            renderItem={({item}) => <CommonItem common={item} />}
            keyExtractor={(x) => x.id}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({section}) => (
              <CommonListSectionHeader {...section} />
            )}
            ListFooterComponent={<CommonListFooter />}
            initialNumToRender={4}
          />
        )}

        <AddCommonButton />
      </SafeAreaView>
      {isLoading && <Loader isBigger isFullScreen />}
    </>
  );
});

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.backgroundWhite},
});
