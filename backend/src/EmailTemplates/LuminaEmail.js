const luminaEmail = (title, body, preheader = '') => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${title}</title>

    <style>
        @media only screen and (max-width: 640px) {

            .email-wrapper {
                padding: 24px 12px !important;
            }

            .email-card {
                width: 100% !important;
                border-radius: 16px !important;
            }

            .email-header {
                padding: 30px 24px 26px 24px !important;
            }

            .email-content {
                padding: 28px 24px !important;
            }

            .email-bottom {
                padding: 0 24px 30px 24px !important;
            }

            .email-footer {
                padding: 20px 24px !important;
            }

            .email-title {
                font-size: 24px !important;
                line-height: 32px !important;
            }

            .email-button {
                width: auto !important;
            }
        }
    </style>
</head>


<body style="
    margin:0;
    padding:0;
    background-color:#09090b;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    color:#f4f4f5;
">


<!-- Preheader -->

<div style="
    display:none;
    max-height:0;
    overflow:hidden;
    opacity:0;
    color:transparent;
    font-size:1px;
    line-height:1px;
">
    ${preheader || title}
</div>


<!-- Main Background -->

<table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin:0;
        padding:0;
        background-color:#09090b;
    "
>

    <tr>

        <td
            align="center"
            class="email-wrapper"
            style="
                padding:40px 16px;
            "
        >


            <!-- Main Card -->

            <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                class="email-card"
                style="
                    max-width:620px;
                    background-color:#111113;
                    border:1px solid #27272a;
                    border-radius:20px;
                    overflow:hidden;
                "
            >


                <!-- Accent -->

                <tr>

                    <td style="
                        height:3px;
                        padding:0;
                        background-color:#1F8482;
                        font-size:0;
                        line-height:0;
                    ">
                        &nbsp;
                    </td>

                </tr>


                <!-- Header -->

                <tr>

                    <td
                        class="email-header"
                        style="
                            padding:30px 34px 28px 34px;
                        "
                    >


                        <!-- Logo -->

                        <table
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                        >

                            <tr>


                                <!-- Logo Icon -->

                                <td
                                    valign="middle"
                                    style="
                                        width:40px;
                                        height:40px;
                                        background-color:#1F8482;
                                        border-radius:10px;
                                        text-align:center;
                                        vertical-align:middle;
                                    "
                                >

                                    <div style="
                                        width:40px;
                                        height:40px;
                                        line-height:40px;
                                        font-size:18px;
                                        font-weight:700;
                                        color:#ffffff;
                                    ">
                                        L
                                    </div>

                                </td>


                                <!-- Logo Text -->

                                <td
                                    valign="middle"
                                    style="
                                        padding-left:12px;
                                    "
                                >

                                    <div style="
                                        font-size:21px;
                                        line-height:28px;
                                        font-weight:700;
                                        letter-spacing:0.2px;
                                        color:#fafafa;
                                    ">
                                        Lumina
                                    </div>

                                </td>


                            </tr>

                        </table>


                        <!-- Label -->

                        <div style="
                            margin-top:27px;
                            font-size:11px;
                            line-height:16px;
                            font-weight:700;
                            letter-spacing:2px;
                            text-transform:uppercase;
                            color:#1F8482;
                        ">
                            Lumina E-Commerce
                        </div>


                        <!-- Title -->

                        <div
                            class="email-title"
                            style="
                                margin-top:9px;
                                font-size:27px;
                                line-height:36px;
                                font-weight:700;
                                letter-spacing:-0.5px;
                                color:#fafafa;
                            "
                        >
                            ${title}
                        </div>


                        <!-- Subtitle -->

                        <div style="
                            margin-top:8px;
                            font-size:14px;
                            line-height:22px;
                            color:#71717a;
                        ">
                            A secure notification from your Lumina account.
                        </div>


                    </td>

                </tr>


                <!-- Divider -->

                <tr>

                    <td style="
                        height:1px;
                        padding:0;
                        background-color:#27272a;
                        font-size:0;
                        line-height:0;
                    ">
                        &nbsp;
                    </td>

                </tr>


                <!-- Main Content -->

                <tr>

                    <td
                        class="email-content"
                        style="
                            padding:32px 34px;
                        "
                    >

                        <div style="
                            font-size:15px;
                            line-height:27px;
                            color:#a1a1aa;
                        ">
                            ${body}
                        </div>


                        <!-- Status Card -->

                        <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                margin-top:28px;
                            "
                        >

                            <tr>

                                <td style="
                                    padding:17px 19px;
                                    background-color:#18181b;
                                    border:1px solid #27272a;
                                    border-radius:14px;
                                ">


                                    <table
                                        role="presentation"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                    >

                                        <tr>


                                            <!-- Status Dot -->

                                            <td
                                                valign="middle"
                                                style="
                                                    width:10px;
                                                    height:10px;
                                                "
                                            >

                                                <div style="
                                                    width:9px;
                                                    height:9px;
                                                    background-color:#6ee7b7;
                                                    border-radius:50%;
                                                    font-size:0;
                                                ">
                                                    &nbsp;
                                                </div>

                                            </td>


                                            <!-- Status Text -->

                                            <td
                                                valign="middle"
                                                style="
                                                    padding-left:12px;
                                                "
                                            >

                                                <div style="
                                                    font-size:13px;
                                                    line-height:20px;
                                                    font-weight:600;
                                                    color:#d4d4d8;
                                                ">
                                                    Lumina notification
                                                </div>

                                                <div style="
                                                    margin-top:2px;
                                                    font-size:12px;
                                                    line-height:18px;
                                                    color:#71717a;
                                                ">
                                                    This message was sent securely from Lumina.
                                                </div>

                                            </td>


                                        </tr>

                                    </table>


                                </td>

                            </tr>

                        </table>


                    </td>

                </tr>


                <!-- Bottom Brand -->

                <tr>

                    <td
                        class="email-bottom"
                        style="
                            padding:0 34px 34px 34px;
                        "
                    >


                        <!-- Divider -->

                        <div style="
                            height:1px;
                            background-color:#27272a;
                            font-size:0;
                            line-height:0;
                        ">
                            &nbsp;
                        </div>


                        <div style="
                            padding-top:24px;
                        ">

                            <div style="
                                font-size:12px;
                                line-height:19px;
                                color:#71717a;
                            ">
                                Thank you for choosing
                            </div>


                            <div style="
                                margin-top:3px;
                                font-size:16px;
                                line-height:24px;
                                font-weight:600;
                                color:#fafafa;
                            ">
                                Lumina
                            </div>


                            <div style="
                                margin-top:3px;
                                font-size:12px;
                                line-height:19px;
                                color:#1F8482;
                            ">
                                Your smarter shopping experience.
                            </div>

                        </div>


                    </td>

                </tr>


                <!-- Footer -->

                <tr>

                    <td
                        class="email-footer"
                        style="
                            padding:20px 34px;
                            background-color:#0d0d0f;
                            border-top:1px solid #27272a;
                            text-align:center;
                        "
                    >

                        <div style="
                            font-size:11px;
                            line-height:18px;
                            color:#52525b;
                        ">
                            This is an automated email from Lumina.
                        </div>


                        <div style="
                            margin-top:4px;
                            font-size:11px;
                            line-height:18px;
                            color:#3f3f46;
                        ">
                            Please do not reply directly to this message.
                        </div>

                    </td>

                </tr>


            </table>


            <!-- Outside Footer -->

            <div style="
                padding-top:18px;
                font-size:10px;
                line-height:16px;
                color:#3f3f46;
                text-align:center;
            ">
                © ${new Date().getFullYear()} Lumina. All rights reserved.
            </div>


        </td>

    </tr>

</table>

</body>

</html>
`;

export default luminaEmail;