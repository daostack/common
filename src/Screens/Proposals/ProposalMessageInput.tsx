import React from 'react';

export const ProposalMessageInput = () => {
  let viewStyle = styles.input;
  if (isMember) {
    viewStyle = {...viewStyle, borderBottomWidth: 0};
  }

  const isEmptyMessage = () => !(inputText && inputText.trim().length);

  return isMember || isProposer ? (
    <KeyboardAvoidingView
      style={{
        position: 'absolute',
        bottom: 0,
        flex: 1,
        color: '#fbfdff',
      }}>
      <View style={viewStyle}>
        <View style={styles.inputBorder}>
          <TextInput
            ref={inputRef}
            editable={true}
            fontSize={15}
            multiline
            placeholder="What do you think?"
            onChangeText={(currText) => setInputText(currText)}
            onContentSizeChange={(event) => {
              setInputHeight(event.nativeEvent.contentSize.height);
            }}
            style={{
              flex: 1,
              padding: 0,
              marginHorizontal: 10,
              maxHeight: 110,
              height: Math.max(35, inputHeight + 10),
            }}
          />
          <TouchableOpacity
            onPress={sendMessageToDiscussion}
            style={{
              paddingRight: 15,
              justifyContent: 'center',
            }}
            disabled={isEmptyMessage()}>
            <Icon
              name="send-message"
              size={20}
              color={isEmptyMessage() ? colors.grey3 : colors.mainBlue}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          height: 30,
          backgroundColor: colors.white,
        }}
      />
    </KeyboardAvoidingView>
  ) : (
    <View style={viewStyle}>
      <Text style={{...styles.joinCommonText}}>
        Only members or proposal creators can send messages
      </Text>
    </View>
  );
};
