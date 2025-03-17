// Name: RoomRealm
// ID: roomRealm
// Description: Adds multiplayer functionality to Scratch projects, including account management, room hosting, messaging, and user interaction. A must-have for interactive projects!
// By: Thebloxers998 <https://scratch.mit.edu/users/Thebloxers998/>
// License: MPL-2.0

class RoomRealmExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.loggedInUser = null; // To store logged-in user info
    }

    getInfo() {
        return {
            id: 'roomRealm',
            name: 'RoomRealm',
            color1: '#4C97FF', // Primary color for all blocks
            color2: '#3373CC', // Secondary color
            color3: '#2A5DA8', // Outline color
            blocks: [
                {
                    opcode: 'createAccount',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Create Account with username [USERNAME] and password [PASSWORD]',
                    arguments: {
                        USERNAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Username'
                        },
                        PASSWORD: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Password'
                        },
                    },
                },
                {
                    opcode: 'connectAccount',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Connect to account with username [USERNAME]',
                    arguments: {
                        USERNAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Username'
                        },
                    },
                },
                {
                    opcode: 'hostRoom',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Host a room named [ROOMNAME]',
                    arguments: {
                        ROOMNAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Super Cool Room'
                        },
                    },
                },
                {
                    opcode: 'joinRoom',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Join a room named [ROOMNAME]',
                    arguments: {
                        ROOMNAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Room Name'
                        },
                    },
                },
                {
                    opcode: 'sendMessage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Send message [MESSAGE] to room',
                    arguments: {
                        MESSAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Hello, world!'
                        },
                    },
                },
                {
                    opcode: 'receiveMessage',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Get last message received',
                },
                {
                    opcode: 'listUsers',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'List all users in room',
                },
            ],
        };
    }

    async createAccount({ USERNAME, PASSWORD }) {
        try {
            const response = await fetch('https://your-backend-service.com/createAccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error creating account:', error);
        }
    }

    async connectAccount({ USERNAME }) {
        try {
            const response = await fetch('https://your-backend-service.com/connectAccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: USERNAME }),
            });
            const result = await response.json();
            if (result.success) {
                this.loggedInUser = USERNAME;
                console.log('Connected as:', USERNAME);
            } else {
                console.error('Failed to connect:', result.message);
            }
        } catch (error) {
            console.error('Error connecting to account:', error);
        }
    }

    async hostRoom({ ROOMNAME }) {
        if (!this.loggedInUser) {
            console.error('You must be logged in to host a room.');
            return;
        }
        try {
            const response = await fetch('https://your-backend-service.com/hostRoom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.loggedInUser, roomName: ROOMNAME }),
            });
            const result = await response.json();
            console.log('Room hosted:', result.message);
        } catch (error) {
            console.error('Error hosting room:', error);
        }
    }

    async joinRoom({ ROOMNAME }) {
        try {
            const response = await fetch('https://your-backend-service.com/joinRoom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.loggedInUser, roomName: ROOMNAME }),
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error joining room:', error);
        }
    }

    async sendMessage({ MESSAGE }) {
        try {
            const response = await fetch('https://your-backend-service.com/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.loggedInUser, message: MESSAGE }),
            });
            console.log('Message sent');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    async receiveMessage() {
        try {
            const response = await fetch('https://your-backend-service.com/receiveMessage');
            const result = await response.json();
            return result.lastMessage || 'No messages received yet';
        } catch (error) {
            console.error('Error receiving messages:', error);
            return 'Error';
        }
    }

    async listUsers() {
        try {
            const response = await fetch('https://your-backend-service.com/listUsers');
            const result = await response.json();
            return result.users.join(', ');
        } catch (error) {
            console.error('Error listing users:', error);
            return 'Error';
        }
    }
}

// Register the extension with the RoomRealm name
Scratch.extensions.register(new RoomRealmExtension());
