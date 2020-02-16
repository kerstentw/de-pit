emintd unsafe-reset-all
rm ~/.emintd/config/genesis.json
rm -r ~/.emintd/config/gentx

# Set moniker and chain-id for Ethermint (Moniker can be anything, chain-id must be an integer)
emintd init depit_chain --chain-id 8

# Set up config for CLI
emintcli config chain-id 8
emintcli config output json
emintcli config indent true
emintcli config trust-node true

# Allocate genesis accounts (cosmos formatted addresses)
emintd add-genesis-account $(emintcli keys show depit_ethermint -a) 210000000000000000000photon,310000000000000000000stake 

# Sign genesis transaction
emintd gentx --name depit_ethermint --amount=50000000000000000000stake --keyring-backend file 
# Collect genesis tx
emintd collect-gentxs

# Run this to ensure everything worked and that the genesis file is setup correctly
emintd validate-genesis

# Start the node (remove the --pruning=nothing flag if historical queries are not needed)
emintd start --pruning=nothing
