import React, { useState } from 'react';

import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Form from '@cloudscape-design/components/form';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';

import { SettingSelect } from '@/components/Settings/Common';
import { ImageViewer } from '@/components/Settings/ImageViewer';
import { useAppSettingsContext } from '@/store/appSettings';
import { AppSettingKeys, AppSettings } from '@/store/appSettings/appSettings.type';
import { DEFAULT_SETTINGS } from '@/store/appSettings/defaultSettings';

export default function Settings() {
    const { appSettings, setAppSettings } = useAppSettingsContext();
    const [isSaving, setIsSaving] = useState(false);
    const [localSettings, setLocalSettings] = useState<AppSettings>(appSettings);

    function handleResetToDefaults() {
        setLocalSettings(DEFAULT_SETTINGS);
    }

    function handleReload() {
        setLocalSettings(appSettings);
    }

    function handleSave() {
        setIsSaving(true);
        setTimeout(() => {
            setAppSettings(localSettings);
            setIsSaving(false);
            window.location.reload();
        }, 300);
    }

    return (
        <ContentLayout
            headerVariant={'high-contrast'}
            header={
                <Header variant="h2" description="Sample agent desktop integration">
                    Agent Desktop
                </Header>
            }
        >
            <Container>
                <ImageViewer 
                    src="https://i.ytimg.com/vi/8L8TC9fSSK4/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYACsAWKAgwIABABGFUgYShlMA8=&rs=AOn4CLDUoKZ_MPD6D0M0k3xinNGBcBReqw"
                    alt="Genesys Agent Desktop"
                />
                
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <Form
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button disabled={isSaving} formAction="none" onClick={() => handleReload()}>
                                    Reload
                                </Button>
                                <Button disabled={isSaving} variant="primary">
                                    {isSaving ? <Spinner /> : 'Save'}
                                </Button>
                            </SpaceBetween>
                        }
                        secondaryActions={
                            <Button disabled={isSaving} formAction="none" onClick={() => handleResetToDefaults()}>
                                Reset to Defaults
                            </Button>
                        }
                    >
                        <SpaceBetween size={'m'}>
                            <SettingSelect
                                formLabel="AWS HealthScribe Region"
                                formDescription="As of April 13, 2024, AWS HealthScribe is available in the US East (N. Virginia) region."
                                optionKey={AppSettingKeys.Region}
                                selectedOption={localSettings['app.region']}
                                setLocalSettings={setLocalSettings}
                            />
                            <SettingSelect
                                formLabel="Amazon Comprehend Medical"
                                formDescription={
                                    <>
                                        Extend AWS HealthScribe with{' '}
                                        <Link
                                            href="https://aws.amazon.com/comprehend/medical/"
                                            external={true}
                                            variant="primary"
                                            fontSize="body-s"
                                        >
                                            Amazon Comprehend Medical
                                        </Link>{' '}
                                        for ontology linking and medical entity extraction.
                                    </>
                                }
                                optionKey={AppSettingKeys.ComprehendMedicalEnabled}
                                selectedOption={localSettings['app.comprehendMedicalEnabled']}
                                setLocalSettings={setLocalSettings}
                            />
                            <ExpandableSection headerText="Advanced">
                                <SpaceBetween direction="vertical" size="m">
                                    <SettingSelect
                                        formLabel="API Timing"
                                        formDescription="Print API timing information in the browser console."
                                        optionKey={AppSettingKeys.ApiTiming}
                                        selectedOption={localSettings['app.apiTiming']}
                                        setLocalSettings={setLocalSettings}
                                    />
                                </SpaceBetween>
                            </ExpandableSection>
                        </SpaceBetween>
                    </Form>
                </form>
            </Container>
        </ContentLayout>
    );
}
