/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import * as React from 'react';
import { mountWithIntl } from 'test_utils/enzyme_helpers';
import { coreMock } from '../../../../../../../src/core/public/mocks';
import {
  ActionsConnectorsContextProvider,
  ActionsConnectorsContextValue,
} from '../../context/actions_connectors_context';
import { actionTypeRegistryMock } from '../../action_type_registry.mock';
import { ActionTypeMenu } from './action_type_menu';
import { ValidationResult } from '../../../types';
const actionTypeRegistry = actionTypeRegistryMock.create();

describe('connector_add_flyout', () => {
  let deps: ActionsConnectorsContextValue;

  beforeAll(async () => {
    const mockes = coreMock.createSetup();
    const [
      {
        application: { capabilities },
      },
    ] = await mockes.getStartServices();
    deps = {
      http: mockes.http,
      toastNotifications: mockes.notifications.toasts,
      capabilities: {
        ...capabilities,
        actions: {
          delete: true,
          save: true,
          show: true,
        },
      },
      actionTypeRegistry: actionTypeRegistry as any,
    };
  });

  it('renders action type menu with proper EuiCards for registered action types', () => {
    const onActionTypeChange = jest.fn();
    const actionType = {
      id: 'my-action-type',
      iconClass: 'test',
      selectMessage: 'test',
      validateConnector: (): ValidationResult => {
        return { errors: {} };
      },
      validateParams: (): ValidationResult => {
        const validationResult = { errors: {} };
        return validationResult;
      },
      actionConnectorFields: null,
      actionParamsFields: null,
    };
    actionTypeRegistry.get.mockReturnValueOnce(actionType);

    const wrapper = mountWithIntl(
      <ActionsConnectorsContextProvider
        value={{
          http: deps!.http,
          actionTypeRegistry: deps!.actionTypeRegistry,
          capabilities: deps!.capabilities,
          toastNotifications: deps!.toastNotifications,
          reloadConnectors: () => {
            return new Promise<void>(() => {});
          },
        }}
      >
        <ActionTypeMenu
          onActionTypeChange={onActionTypeChange}
          actionTypes={[
            {
              id: actionType.id,
              enabled: true,
              name: 'Test',
            },
          ]}
        />
      </ActionsConnectorsContextProvider>
    );

    expect(wrapper.find('[data-test-subj="my-action-type-card"]').exists()).toBeTruthy();
  });
});
