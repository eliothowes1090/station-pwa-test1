import Adapter from '../../../../../Adapter';
import nativeRpc from '../../../../../../Pages/NativeRpc';

export default class TD3128 extends Adapter {
  // Required by Device class
  static id = 'taidoc-td3128-ble';
  static vendor = 'TAIDOC';
  static model = 'TD-3128';
  static connectionType = 'ble';
  static connectionProperties = {
    deviceAddress: 'C0-26-DA-0D-0F-B4',
    deviceName: 'TAIDOC TD3128',
    services: {}
  };

  async open () {
    super.open();

    this._log('waiting for device connection');

    try {
      const bleResponse = await nativeRpc.getDeviceAndMeasurement(TD3128.id);
      this._processDataObject(bleResponse);
    }
    catch (err) {
      console.error('Caught error:', err);
      await this.close();
    }

    this._log('connection opened');
    this._changeStatus('connected');
  }

  async close (targetRevision = this.revision) {
    super.close(targetRevision);

    // Change the revision will cause any outstanding requests to fail/end
    this.revision += 1;

    this._changeStatus('disconnected');

    await nativeRpc.closeDevice();

    this._log('closed');
  }
}
