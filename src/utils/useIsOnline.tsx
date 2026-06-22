import { NetInfoState, useNetInfo } from "@react-native-community/netinfo";

const useIsOnline = (): boolean => {
  const netInfo: NetInfoState = useNetInfo();

  return netInfo.type !== "unknown" && netInfo.isConnected === true;
};

export default useIsOnline;
